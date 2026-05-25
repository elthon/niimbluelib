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
        <slider :value="density" :min="densityMin" :max="densityMax" :step="1" show-value
          activeColor="#333" @change="density = $event.detail.value" />
      </view>

      <view class="form-item">
        <text class="form-label">打印份数 ({{ quantity }})</text>
        <slider :value="quantity" :min="1" :max="10" :step="1" show-value
          activeColor="#333" @change="quantity = $event.detail.value" />
      </view>

      <view class="form-item">
        <text class="form-label">发送间隔 ({{ packetIntervalMs }}ms)</text>
        <slider :value="packetIntervalMs" :min="0" :max="10" :step="1" show-value
          activeColor="#333" @change="onPacketIntervalChange" />
      </view>

      <view class="form-item">
        <text class="form-label">打印方向</text>
        <picker :range="['左旋90° (left)', '从上到下 (top)']" :value="printDirection === 'left' ? 0 : 1"
          @change="printDirection = $event.detail.value == 0 ? 'left' : 'top'">
          <view class="picker-value">{{ printDirection === 'left' ? '左旋90°' : '从上到下' }} ▾</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">纸张尺寸 (mm)</text>
        <view class="size-row">
          <input class="size-input" type="number" v-model="paperW" placeholder="宽mm" />
          <text class="size-x">×</text>
          <input class="size-input" type="number" v-model="paperH" placeholder="高mm" />
          <button class="btn btn-small" @click="onCalcFromPaper">换算</button>
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">画布像素 (DPI: {{ printerDpi }})</text>
        <view class="size-row">
          <input class="size-input" type="number" v-model="canvasW" placeholder="宽px" />
          <text class="size-x">×</text>
          <input class="size-input" type="number" v-model="canvasH" placeholder="高px" />
          <button class="btn btn-small" @click="onResizeCanvas">应用</button>
        </view>
      </view>
    </view>

    <!-- 画布预览 -->
    <view class="card">
      <view class="card-title">打印预览 ({{ canvasWidth }}×{{ canvasHeight }}px)</view>
      <view class="canvas-wrapper">
        <view class="canvas-viewport" :style="canvasViewportStyle">
          <canvas canvas-id="printCanvas" :style="canvasStyle" class="print-canvas" />
          <image v-if="previewImagePath" :src="previewImagePath" mode="widthFix" :style="previewImageStyle"
            class="preview-image" />
        </view>
      </view>
      <view class="btn-row">
        <button class="btn btn-small" :class="currentPattern==='lines'?'btn-active':''" @click="drawTestPattern('lines')">线条</button>
        <button class="btn btn-small" :class="currentPattern==='grid'?'btn-active':''" @click="drawTestPattern('grid')">网格</button>
        <button class="btn btn-small" :class="currentPattern==='text'?'btn-active':''" @click="drawTestPattern('text')">文字</button>
        <button class="btn btn-small" :class="currentPattern==='batchLabel'?'btn-active':''" @click="drawTestPattern('batchLabel')">批次码</button>
        <button class="btn btn-small" :class="currentPattern==='fill'?'btn-active':''" @click="drawTestPattern('fill')">全黑</button>
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

import { encodeImageData, encodeUniCanvas } from "@/utils/image-helper.js";

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
      density: 3,
      densityMin: 1,
      densityMax: 15,
      quantity: 1,
      packetIntervalMs: 2,
      printDirection: "top",
      paperW: "80",
      paperH: "60",
      printerDpi: 300,
      canvasW: "848",
      canvasH: "712",
      canvasWidth: 848,
      canvasHeight: 712,
      previewImagePath: "",

      currentPattern: "batchLabel",
      printing: false,
      printProgress: 0,
      printStatus: "",

      logs: [],
      logScrollTop: 0,

      labelTypeNames: LABEL_TYPES.map((t) => t.name),
      screenWidth: 320,
    };
  },

  computed: {
    canvasScale() {
      return Math.min(1, this.getMaxCanvasWidth() / this.canvasWidth);
    },

    canvasViewportStyle() {
      return {
        width: Math.round(this.canvasWidth * this.canvasScale) + "px",
        height: Math.round(this.canvasHeight * this.canvasScale) + "px",
      };
    },

    canvasStyle() {
      return {
        width: this.canvasWidth + "px",
        height: this.canvasHeight + "px",
        transform: "scale(" + this.canvasScale + ")",
        transformOrigin: "0 0",
      };
    },

    previewImageStyle() {
      return {
        width: Math.round(this.canvasWidth * this.canvasScale) + "px",
      };
    },
  },

  onReady() {
    try {
      const sysInfo = uni.getSystemInfoSync();
      this.screenWidth = sysInfo.windowWidth || 360;
    } catch (e) { this.screenWidth = 360; }
    this.drawTestPattern(this.currentPattern);
    this.log("页面就绪，屏幕宽度: " + this.screenWidth + "px");
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

        // Auto-detect DPI from printer model metadata
        const meta = client.getModelMetadata();
        if (meta) {
          this.printerDpi = meta.dpi;
          this.densityMin = meta.densityMin;
          this.densityMax = meta.densityMax;
          this.density = meta.densityDefault;
          this.printDirection = meta.printDirection;
          this.log("检测到: " + meta.model + ", DPI=" + meta.dpi +
            ", 打印头=" + meta.printheadPixels + "px" +
            ", 方向=" + meta.printDirection +
            ", 浓度=" + meta.densityMin + "-" + meta.densityMax, "success");
          // Auto-recalculate canvas size from paper dimensions
          this.onCalcFromPaper();
        } else {
          this.log("未找到型号元数据 (modelId=" + e.info.modelId + ")，使用默认设置", "warn");
        }
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
      this.client.setPacketInterval(this.packetIntervalMs);
    },

    onPacketIntervalChange(e) {
      this.packetIntervalMs = Number(e.detail.value);
      this.client?.setPacketInterval(this.packetIntervalMs);
    },

    async onScan() {
      this.connecting = true;
      this.log("开始扫描蓝牙设备...");

      try {
        this.initClient();
        this.log("客户端已创建: " + (this.client ? this.client.constructor.name : "null"));
      } catch (e) {
        this.connecting = false;
        this.log("创建客户端失败: " + e.message, "error");
        this.log("Stack: " + (e.stack || ""), "error");
        uni.showToast({ title: "创建客户端失败", icon: "none", duration: 3000 });
        return;
      }

      try {
        this.log("开始调用 connect()...");
        await this.client.connect({ scanTimeoutMs: 20000 });
      } catch (e) {
        this.connecting = false;
        this.log("连接失败: " + e.message, "error");
        this.log("Stack: " + (e.stack || ""), "error");
        uni.showToast({ title: "连接失败: " + e.message, icon: "none", duration: 3000 });
      }
    },

    async onDisconnect() {
      await this.client?.disconnect();
      this.client = null;
    },

    mmToPixels(mm, dpi) {
      // mm -> pixels, round to nearest 8
      const px = Math.round(mm * dpi / 25.4);
      return Math.ceil(px / 8) * 8;
    },

    onCalcFromPaper() {
      const wMm = parseFloat(this.paperW) || 80;
      const hMm = parseFloat(this.paperH) || 60;
      const dpi = this.printerDpi || 300;
      let wPx = this.mmToPixels(wMm, dpi);
      let hPx = this.mmToPixels(hMm, dpi);

      // Clamp width to printhead pixels if known
      const meta = this.client ? this.client.getModelMetadata() : null;
      if (meta && wPx > meta.printheadPixels) {
        wPx = Math.floor(meta.printheadPixels / 8) * 8;
      }

      this.log("纸张 " + wMm + "x" + hMm + "mm @ " + dpi + "dpi = " + wPx + "x" + hPx + "px");

      this.canvasW = String(wPx);
      this.canvasH = String(hPx);
      this.onResizeCanvas();
    },

    getMaxCanvasWidth() {
      return Math.floor((this.screenWidth - 32) / 8) * 8;
    },

    onResizeCanvas() {
      let w = parseInt(this.canvasW) || 240;
      let h = parseInt(this.canvasH) || 160;
      if (this.printDirection === "left") {
        if (h % 8 !== 0) h = Math.ceil(h / 8) * 8;
      } else if (w % 8 !== 0) {
        w = Math.ceil(w / 8) * 8;
      }
      this.canvasW = String(w);
      this.canvasH = String(h);
      this.canvasWidth = w;
      this.canvasHeight = h;
      this.$nextTick(() => this.drawTestPattern(this.currentPattern));
    },

    /** Re-draw current pattern with draw(true, callback) + delay to guarantee pixels are flushed */
    redrawForPrint() {
      return new Promise((resolve) => {
        const ctx = uni.createCanvasContext("printCanvas", this);
        const w = this.canvasWidth;
        const h = this.canvasHeight;
        this._drawPatternToCtx(ctx, w, h, this.currentPattern);
        ctx.draw(true, () => {
          // Extra delay to let the pixel buffer fully sync on Android
          setTimeout(resolve, 150);
        });
      });
    },

    drawTestPattern(pattern) {
      this.currentPattern = pattern;
      const ctx = uni.createCanvasContext("printCanvas", this);
      const w = this.canvasWidth;
      const h = this.canvasHeight;
      this._drawPatternToCtx(ctx, w, h, pattern);
      ctx.draw(false, () => {
        setTimeout(() => this.updatePreviewImage(), 80);
      });
    },

    updatePreviewImage() {
      uni.canvasToTempFilePath({
        canvasId: "printCanvas",
        x: 0,
        y: 0,
        width: this.canvasWidth,
        height: this.canvasHeight,
        destWidth: this.canvasWidth,
        destHeight: this.canvasHeight,
        success: (res) => {
          this.previewImagePath = res.tempFilePath;
        },
        fail: (err) => {
          this.log("生成完整预览失败: " + err.errMsg, "warn");
        },
      }, this);
    },

    drawBoldText(ctx, text, x, y, size, align = "left") {
      ctx.setFontSize(size);
      ctx.setTextAlign(align);
      ctx.setFillStyle("#000000");
      ctx.fillText(text, x, y);
      ctx.fillText(text, x + 1, y);
    },

    drawNormalText(ctx, text, x, y, size, align = "left") {
      ctx.setFontSize(size);
      ctx.setTextAlign(align);
      ctx.setFillStyle("#000000");
      ctx.fillText(text, x, y);
    },

    drawField(ctx, label, value, labelX, valueX, y, valueSize = 31) {
      this.drawBoldText(ctx, label, labelX, y, 34);
      this.drawNormalText(ctx, value, valueX, y, valueSize);
    },

    drawWrappedText(ctx, lines, x, y, size, lineHeight) {
      for (let i = 0; i < lines.length; i++) {
        this.drawNormalText(ctx, lines[i], x, y + i * lineHeight, size);
      }
    },

    drawFinder(ctx, x, y, unit) {
      const s = unit * 7;
      ctx.setFillStyle("#000000");
      ctx.fillRect(x, y, s, s);
      ctx.setFillStyle("#ffffff");
      ctx.fillRect(x + unit, y + unit, unit * 5, unit * 5);
      ctx.setFillStyle("#000000");
      ctx.fillRect(x + unit * 2, y + unit * 2, unit * 3, unit * 3);
    },

    drawQrLike(ctx, x, y, size) {
      const cells = 29;
      const unit = Math.floor(size / cells);
      const realSize = unit * cells;

      ctx.setFillStyle("#ffffff");
      ctx.fillRect(x, y, realSize, realSize);
      this.drawFinder(ctx, x, y, unit);
      this.drawFinder(ctx, x + realSize - unit * 7, y, unit);
      this.drawFinder(ctx, x, y + realSize - unit * 7, unit);

      ctx.setFillStyle("#000000");
      for (let row = 0; row < cells; row++) {
        for (let col = 0; col < cells; col++) {
          const inTopLeft = row < 8 && col < 8;
          const inTopRight = row < 8 && col >= cells - 8;
          const inBottomLeft = row >= cells - 8 && col < 8;
          if (inTopLeft || inTopRight || inBottomLeft) continue;

          const v = (row * 17 + col * 31 + row * col) % 11;
          if (v === 0 || v === 3 || v === 7 || (row % 5 === 0 && col % 3 === 0)) {
            ctx.fillRect(x + col * unit, y + row * unit, unit, unit);
          }
        }
      }
    },

    drawBatchLabel(ctx, w, h) {
      const sx = w / 848;
      const sy = h / 712;
      const s = Math.min(sx, sy);
      const x = (v) => Math.round(v * sx);
      const y = (v) => Math.round(v * sy);
      const fs = (v) => Math.max(12, Math.round(v * s));

      ctx.setFillStyle("#ffffff");
      ctx.fillRect(0, 0, w, h);
      ctx.setFillStyle("#000000");
      ctx.setStrokeStyle("#000000");
      ctx.setTextBaseline("top");

      const l1 = x(54);
      const v1 = x(220);
      const l2 = x(458);
      const v2 = x(624);
      const rows = [24, 80, 136, 192, 248, 304].map(y);

      this.drawField(ctx, "产品属性:", "中药材", l1, v1, rows[0], fs(30));
      this.drawField(ctx, "品    名:", "白莲子", l1, v1, rows[1], fs(30));
      this.drawField(ctx, "产    地:", "湖南省湘潭市", l1, v1, rows[2], fs(30));
      this.drawField(ctx, "采收日期:", "2024-08", l1, v1, rows[3], fs(30));
      this.drawField(ctx, "数    量:", "50kg", l1, v1, rows[4], fs(30));
      this.drawField(ctx, "贮    藏:", "置干燥处，防蛀", l1, v1, rows[5], fs(29));

      this.drawField(ctx, "产品批号:", "B202408001", l2, v2, rows[0], fs(30));
      this.drawField(ctx, "规    格:", "统货", l2, v2, rows[1], fs(30));
      this.drawField(ctx, "包装日期:", "2024-08", l2, v2, rows[2], fs(30));
      this.drawField(ctx, "加工日期:", "2024-08", l2, v2, rows[3], fs(30));
      this.drawField(ctx, "保 质 期:", "36个月", l2, v2, rows[4], fs(30));
      this.drawField(ctx, "质检标识:", "质检合格", l2, v2, rows[5], fs(29));

      this.drawBoldText(ctx, "执行标准:", l1, y(360), fs(33));
      this.drawNormalText(ctx, "《湖南省中药饮片炮制规范》2021年版", v1, y(363), fs(27));

      this.drawBoldText(ctx, "基    源:", l1, y(415), fs(33));
      this.drawWrappedText(ctx, [
        "本品为睡莲科植物",
        "莲Nelumbo",
        "nucifera Gaertn.的",
        "干燥成熟种子。",
      ], v1, y(417), fs(29), y(42));

      this.drawBoldText(ctx, "湖", x(555), y(455), fs(31), "center");
      this.drawBoldText(ctx, "源", x(555), y(493), fs(31), "center");
      this.drawBoldText(ctx, "码", x(555), y(531), fs(31), "center");
      this.drawQrLike(ctx, x(610), y(385), Math.min(x(205), y(205)));

      this.drawField(ctx, "经 纬 度:", "E112°50′17″-112°51′26″； N27°22′44″-27°23′42″", l1, x(210), y(628), fs(26));
      this.drawField(ctx, "生产企业:", "湘潭县谭智奇中药材种植专业合作社", l1, x(205), y(678), fs(28));
    },

    _drawPatternToCtx(ctx, w, h, pattern) {
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
        const fontSize = Math.max(20, Math.round(w / 15));
        ctx.setFontSize(fontSize);
        ctx.setTextAlign("center");
        ctx.setTextBaseline("middle");
        ctx.fillText("NiimBlue", w / 2, h / 3);
        ctx.setFontSize(Math.round(fontSize * 0.7));
        ctx.fillText("打印测试 Print Test", w / 2, h / 3 + fontSize * 1.4);
        ctx.setFontSize(Math.round(fontSize * 0.5));
        ctx.fillText(w + " x " + h + "px", w / 2, h / 3 + fontSize * 2.4);
        ctx.strokeRect(1, 1, w - 2, h - 2);
      } else if (pattern === "batchLabel") {
        this.drawBatchLabel(ctx, w, h);
      } else if (pattern === "fill") {
        ctx.fillRect(0, 0, w, h);
      }
    },

    async onPrint() {
      if (!this.client || !this.connected) {
        uni.showToast({ title: "请先连接打印机", icon: "none" });
        return;
      }

      this.printing = true;
      this.printProgress = 0;
      this.printStatus = "编码图像...";
      const w = this.canvasWidth;
      const h = this.canvasHeight;
      const dataBytes = Math.ceil(w * h / 8);
      this.log("开始打印 " + w + "x" + h +
        " (" + Math.round(dataBytes / 1024) + "KB, MTU=" + (this.client.mtu || "?") + ")");

      try {
        // Re-draw canvas with callback to ensure pixel buffer is ready
        await this.redrawForPrint();

        const encoded = await encodeUniCanvas(
          "printCanvas", w, h, this.printDirection, this
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
.canvas-viewport { position: relative; overflow: hidden; }
.print-canvas { background: #fff; border: 1rpx solid #ddd; }
.preview-image { position: absolute; left: 0; top: 0; background: #fff; border: 1rpx solid #ddd; }

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
