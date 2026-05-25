<template>
  <view class="container">
    <!-- 蓝牙连接 -->
    <view class="card">
      <view class="card-title">蓝牙连接</view>
      <view class="status-row">
        <view class="status-dot" :class="connected ? 'online' : 'offline'"></view>
        <text class="status-text">{{ connected ? '已连接: ' + deviceName : '未连接' }}</text>
      </view>

      <view v-if="connected && printerInfo.modelId" class="info-grid">
        <view class="info-item">
          <text class="info-label">型号ID</text>
          <text class="info-value">{{ printerInfo.modelId }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">电量</text>
          <text class="info-value">{{ printerInfo.charge != null ? printerInfo.charge + '%' : '-' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">固件</text>
          <text class="info-value">{{ printerInfo.softwareVersion || '-' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">序列号</text>
          <text class="info-value">{{ printerInfo.serial || '-' }}</text>
        </view>
      </view>

      <view class="btn-row">
        <button v-if="!connected" class="btn btn-primary" :disabled="connecting" @click="onScan">
          {{ connecting ? '连接中...' : '扫描连接' }}
        </button>
        <button v-else class="btn btn-danger" @click="onDisconnect">断开</button>
      </view>
    </view>

    <!-- 打印设置 -->
    <view class="card">
      <view class="card-title">打印设置</view>

      <view class="form-item">
        <text class="form-label">标签类型</text>
        <picker :range="labelTypeNames" :value="labelTypeIndex" @change="labelTypeIndex = $event.detail.value">
          <view class="picker-value">{{ labelTypeNames[labelTypeIndex] }} ▾</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">浓度 ({{ density }})</text>
        <slider :value="density" :min="1" :max="5" :step="1" show-value
          activeColor="#333" @change="density = $event.detail.value" />
      </view>

      <view class="form-item">
        <text class="form-label">打印份数 ({{ quantity }})</text>
        <slider :value="quantity" :min="1" :max="10" :step="1" show-value
          activeColor="#333" @change="quantity = $event.detail.value" />
      </view>

      <view class="form-item">
        <text class="form-label">打印方向</text>
        <picker :range="['左旋90° (left)', '从上到下 (top)']" :value="printDirection === 'left' ? 0 : 1"
          @change="printDirection = $event.detail.value == 0 ? 'left' : 'top'">
          <view class="picker-value">{{ printDirection === 'left' ? '左旋90°' : '从上到下' }} ▾</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">画布尺寸</text>
        <view class="size-row">
          <input class="size-input" type="number" v-model="canvasW" placeholder="宽" />
          <text class="size-x">×</text>
          <input class="size-input" type="number" v-model="canvasH" placeholder="高" />
          <button class="btn btn-small" @click="onResizeCanvas">应用</button>
        </view>
      </view>
    </view>

    <!-- 画布预览 -->
    <view class="card">
      <view class="card-title">打印预览</view>
      <view class="canvas-wrapper">
        <canvas canvas-id="printCanvas"
          :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
          class="print-canvas" />
      </view>
      <view class="btn-row">
        <button class="btn btn-small" @click="drawTestPattern('lines')">线条</button>
        <button class="btn btn-small" @click="drawTestPattern('grid')">网格</button>
        <button class="btn btn-small" @click="drawTestPattern('text')">文字</button>
        <button class="btn btn-small" @click="drawTestPattern('fill')">全黑</button>
      </view>
    </view>

    <!-- 打印 -->
    <view class="card">
      <view class="card-title">执行打印</view>
      <view v-if="printing" class="progress-section">
        <view class="progress-text">{{ printStatus }}</view>
        <progress :percent="printProgress" :active="printing" activeColor="#333" stroke-width="4" />
      </view>
      <view class="btn-row">
        <button class="btn btn-primary btn-large" :disabled="!connected || printing" @click="onPrint">
          {{ printing ? '打印中...' : '开始打印' }}
        </button>
      </view>
    </view>

    <!-- 日志 -->
    <view class="card">
      <view class="card-title">
        <text>通信日志</text>
        <text class="log-clear" @click="logs = []">清空</text>
      </view>
      <scroll-view class="log-pane" scroll-y :scroll-top="logScrollTop">
        <view v-for="(item, i) in logs" :key="i" class="log-line" :class="item.type">
          <text>{{ item.text }}</text>
        </view>
        <view v-if="logs.length === 0" class="log-empty">
          <text>暂无日志</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import {
  NiimbotUniAppBleClient,
  RequestCommandId,
  ResponseCommandId,
  LabelType,
} from "@/libs/niimbluelib.js";

import { encodeUniCanvas } from "@/utils/image-helper.js";

const LABEL_TYPES = [
  { name: "有间距 (WithGaps)", value: LabelType.WithGaps },
  { name: "黑标 (Black)", value: LabelType.Black },
  { name: "连续 (Continuous)", value: LabelType.Continuous },
  { name: "透明 (Transparent)", value: LabelType.Transparent },
];

export default {
  data() {
    return {
      client: null,
      connected: false,
      connecting: false,
      deviceName: "",
      printerInfo: {},

      labelTypeIndex: 0,
      density: 2,
      quantity: 1,
      printDirection: "left",
      canvasW: "240",
      canvasH: "160",
      canvasWidth: 240,
      canvasHeight: 160,

      printing: false,
      printProgress: 0,
      printStatus: "",

      logs: [],
      logScrollTop: 0,

      labelTypeNames: LABEL_TYPES.map((t) => t.name),
    };
  },

  onReady() {
    this.drawTestPattern("lines");
  },

  onUnload() {
    this.client?.disconnect();
  },

  methods: {
    log(text, type = "info") {
      this.logs.push({ text, type });
      if (this.logs.length > 500) this.logs = this.logs.slice(-300);
      this.$nextTick(() => { this.logScrollTop = this.logs.length * 40; });
    },

    initClient() {
      const client = new NiimbotUniAppBleClient();

      client.on("packetsent", (e) => {
        const name = RequestCommandId[e.packet.command] || "0x" + e.packet.command.toString(16);
        this.log(">> " + name, "sent");
      });

      client.on("packetreceived", (e) => {
        const name = ResponseCommandId[e.packet.command] || "0x" + e.packet.command.toString(16);
        this.log("<< " + name, "recv");
      });

      client.on("connect", (e) => {
        this.connected = true;
        this.connecting = false;
        this.deviceName = e.info.deviceName || "未知设备";
        this.log("已连接: " + this.deviceName, "success");
      });

      client.on("disconnect", () => {
        this.connected = false;
        this.printerInfo = {};
        this.deviceName = "";
        this.log("已断开连接", "warn");
      });

      client.on("printerinfofetched", (e) => {
        this.printerInfo = { ...e.info };
        this.log("型号ID: " + e.info.modelId + ", 电量: " + (e.info.charge || "?") + "%", "success");
      });

      client.on("printprogress", (e) => {
        this.printProgress = Math.round(
          (e.page / e.pagesTotal) * 50 +
          (e.pagePrintProgress / e.pagesTotal) * 0.3 +
          (e.pageFeedProgress / e.pagesTotal) * 0.2
        );
        this.printStatus = "第 " + (e.page + 1) + "/" + e.pagesTotal +
          " 页 | 打印 " + e.pagePrintProgress + "% | 出纸 " + e.pageFeedProgress + "%";
      });

      client.on("heartbeat", (e) => {
        if (e.data.batteryPercent != null) {
          this.printerInfo = { ...this.printerInfo, charge: e.data.batteryPercent };
        }
      });

      client.on("heartbeatfailed", (e) => {
        if (e.failedAttempts >= 3) this.log("心跳连续失败 " + e.failedAttempts + " 次", "warn");
      });

      this.client = client;
    },

    async onScan() {
      this.connecting = true;
      this.log("开始扫描蓝牙设备...");
      this.initClient();
      try {
        await this.client.connect({ scanTimeoutMs: 20000 });
      } catch (e) {
        this.connecting = false;
        this.log("连接失败: " + e.message, "error");
        uni.showToast({ title: "连接失败", icon: "none", duration: 3000 });
      }
    },

    async onDisconnect() {
      await this.client?.disconnect();
      this.client = null;
    },

    onResizeCanvas() {
      const w = parseInt(this.canvasW) || 240;
      const h = parseInt(this.canvasH) || 160;
      if (w % 8 !== 0) {
        uni.showToast({ title: "宽度必须是 8 的倍数", icon: "none" });
        return;
      }
      this.canvasWidth = w;
      this.canvasHeight = h;
      this.$nextTick(() => this.drawTestPattern("lines"));
    },

    drawTestPattern(pattern) {
      const ctx = uni.createCanvasContext("printCanvas", this);
      const w = this.canvasWidth;
      const h = this.canvasHeight;

      ctx.setFillStyle("#ffffff");
      ctx.fillRect(0, 0, w, h);
      ctx.setStrokeStyle("#000000");
      ctx.setFillStyle("#000000");
      ctx.setLineWidth(2);

      if (pattern === "lines") {
        ctx.strokeRect(1, 1, w - 2, h - 2);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w, 0); ctx.lineTo(0, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
      } else if (pattern === "grid") {
        for (let x = 0; x < w; x += 16) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (let y = 0; y < h; y += 16) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      } else if (pattern === "text") {
        ctx.setFontSize(20); ctx.setTextAlign("center"); ctx.setTextBaseline("middle");
        ctx.fillText("NiimBlue", w / 2, h / 3);
        ctx.setFontSize(14); ctx.fillText("打印测试", w / 2, h / 3 + 28);
        ctx.setFontSize(12); ctx.fillText(w + " x " + h, w / 2, h / 3 + 52);
        ctx.strokeRect(1, 1, w - 2, h - 2);
      } else if (pattern === "fill") {
        ctx.fillRect(0, 0, w, h);
      }

      ctx.draw();
    },

    async onPrint() {
      if (!this.client || !this.connected) {
        uni.showToast({ title: "请先连接打印机", icon: "none" });
        return;
      }

      this.printing = true;
      this.printProgress = 0;
      this.printStatus = "编码图像...";
      this.log("开始打印流程");

      try {
        const encoded = await encodeUniCanvas(
          "printCanvas", this.canvasWidth, this.canvasHeight, this.printDirection, this
        );
        this.log("图像编码完成: " + encoded.cols + "x" + encoded.rows + ", " + encoded.rowsData.length + " 行", "info");

        const printTaskName = this.client.getPrintTaskType() || "B1";
        this.log("打印任务: " + printTaskName);

        const printTask = this.client.abstraction.newPrintTask(printTaskName, {
          totalPages: this.quantity,
          density: this.density,
          labelType: LABEL_TYPES[this.labelTypeIndex].value,
          statusPollIntervalMs: 100,
          statusTimeoutMs: 10000,
        });

        this.printStatus = "初始化...";
        await printTask.printInit();

        this.printStatus = "发送图像...";
        await printTask.printPage(encoded, this.quantity);

        this.printStatus = "等待打印...";
        await printTask.waitForPageFinished();
        await printTask.waitForFinished();

        this.printProgress = 100;
        this.printStatus = "打印完成!";
        this.log("打印完成!", "success");
        uni.showToast({ title: "打印完成", icon: "success" });

        await printTask.printEnd();
      } catch (e) {
        this.log("打印失败: " + e.message, "error");
        this.printStatus = "失败: " + e.message;
        uni.showToast({ title: "打印失败", icon: "none", duration: 3000 });
      } finally {
        setTimeout(() => { this.printing = false; }, 2000);
      }
    },
  },
};
</script>

<style scoped>
.container { padding: 12px; }

.card {
  background: #fff; border-radius: 12px; padding: 16px;
  margin-bottom: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.card-title {
  font-size: 16px; font-weight: 600; margin-bottom: 12px;
  display: flex; justify-content: space-between; align-items: center;
}

.status-row { display: flex; align-items: center; margin-bottom: 10px; }
.status-dot { width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; }
.status-dot.online { background-color: #34c759; }
.status-dot.offline { background-color: #ccc; }
.status-text { font-size: 14px; color: #333; }

.info-grid { display: flex; flex-wrap: wrap; margin-bottom: 10px; background: #f9f9f9; border-radius: 8px; padding: 8px; }
.info-item { width: 50%; padding: 4px 0; }
.info-label { font-size: 11px; color: #999; }
.info-value { font-size: 13px; color: #333; display: block; }

.btn-row { display: flex; flex-wrap: wrap; }
.btn {
  flex: 1; height: 40px; line-height: 40px; text-align: center;
  border-radius: 8px; font-size: 14px; border: none; margin: 0 4px;
}
.btn-primary { background: #333; color: #fff; }
.btn-primary[disabled] { background: #ccc; color: #999; }
.btn-danger { background: #ff3b30; color: #fff; }
.btn-small { flex: none; min-width: 50px; height: 32px; line-height: 32px; font-size: 12px; padding: 0 12px; background: #f0f0f0; color: #333; }
.btn-large { height: 46px; line-height: 46px; font-size: 16px; font-weight: 600; }

.form-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1rpx solid #f0f0f0; }
.form-label { font-size: 14px; color: #333; flex-shrink: 0; width: 120px; }
.picker-value { font-size: 14px; color: #666; text-align: right; }
.size-row { display: flex; align-items: center; }
.size-input { width: 60px; height: 32px; border: 1rpx solid #ddd; border-radius: 6px; text-align: center; font-size: 13px; margin: 0 4px; }
.size-x { font-size: 14px; color: #999; }

.canvas-wrapper { display: flex; justify-content: center; padding: 12px; background: #f9f9f9; border-radius: 8px; margin-bottom: 10px; overflow: hidden; }
.print-canvas { background: #fff; border: 1rpx solid #ddd; }

.progress-section { margin-bottom: 12px; }
.progress-text { font-size: 13px; color: #666; margin-bottom: 6px; }

.log-pane { height: 200px; background: #1e1e1e; border-radius: 8px; padding: 8px; }
.log-line { font-size: 11px; font-family: Menlo, Consolas, monospace; line-height: 1.6; word-break: break-all; }
.log-line.info { color: #b0b0b0; }
.log-line.sent { color: #569cd6; }
.log-line.recv { color: #4ec9b0; }
.log-line.success { color: #6a9955; }
.log-line.warn { color: #ce9178; }
.log-line.error { color: #f44747; }
.log-empty { display: flex; justify-content: center; align-items: center; height: 100%; color: #666; font-size: 12px; }
.log-clear { font-size: 12px; color: #999; }
</style>
