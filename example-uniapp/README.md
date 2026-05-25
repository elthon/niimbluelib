# NiimBlue UniApp 打印测试

基于 niimbluelib 的 UniApp BLE 打印测试项目。

## 使用方式

### 1. 安装依赖

```bash
# 先在根目录构建库
cd ..
npm install && npm run build

# 回到 example-uniapp 安装依赖
cd example-uniapp
npm install
```

### 2. 运行

推荐使用 HBuilderX 打开 `example-uniapp` 目录，直接运行到手机或模拟器。

或使用命令行：

```bash
# 微信小程序
npm run dev:mp-weixin

# App（需要 HBuilderX）
npm run dev:app

# H5（仅供 UI 预览，BLE 不可用）
npm run dev:h5
```

### 3. 测试流程

1. 打开应用，点击 **扫描连接** 搜索附近的精臣打印机
2. 连接成功后可以看到打印机型号、电量等信息
3. 选择测试图案（线条/网格/文字/全黑）
4. 根据标签纸调整 **标签类型**、**浓度**、**份数**
5. 点击 **开始打印** 进行测试
6. 底部日志区域可查看通信数据包

## 注意事项

- 画布宽度必须是 **8 的倍数**
- Android 需要开启蓝牙和定位权限
- 微信小程序需要在 `manifest.json` 中配置正确的 appid
- 如果打印失败，尝试调整打印方向（left/top）
