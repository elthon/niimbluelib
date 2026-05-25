/**
 * UniApp 环境下的图像编码辅助工具。
 *
 * 因为 niimbluelib 的 ImageEncoder.encodeCanvas 依赖 HTMLCanvasElement，
 * 而 UniApp 的 canvas 通过 uni.canvasGetImageData 获取像素，
 * 这里提供一个等价的编码函数，直接处理 RGBA 像素数组。
 */

function isPixelNonWhite(data, x, y, width, height, printDirection) {
  var idx = y * width + x;
  if (printDirection === "left") {
    idx = (height - 1 - x) * width + y;
  }
  idx *= 4;
  return data[idx] !== 255 || data[idx + 1] !== 255 || data[idx + 2] !== 255;
}

function u8ArraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * 将 RGBA 像素数据编码为 EncodedImage（与 niimbluelib 的 ImageEncoder.encodeCanvas 等价）。
 */
function encodeImageData(pixelData, width, height, printDirection) {
  printDirection = printDirection || "left";
  var cols = width;
  var rows = height;

  if (printDirection === "left") {
    cols = height;
    rows = width;
  }

  if (cols % 8 !== 0) {
    throw new Error("列数必须是 8 的倍数，当前: " + cols);
  }

  var rowsData = [];

  for (var row = 0; row < rows; row++) {
    var isVoid = true;
    var blackPixelsCount = 0;
    var rowData = new Uint8Array(cols / 8);

    for (var colOct = 0; colOct < cols / 8; colOct++) {
      var pixelsOctet = 0;
      for (var colBit = 0; colBit < 8; colBit++) {
        if (isPixelNonWhite(pixelData, colOct * 8 + colBit, row, width, height, printDirection)) {
          pixelsOctet |= 1 << (7 - colBit);
          isVoid = false;
          blackPixelsCount++;
        }
      }
      rowData[colOct] = pixelsOctet;
    }

    var newPart = {
      dataType: isVoid ? "void" : "pixels",
      rowNumber: row,
      repeat: 1,
      rowData: isVoid ? undefined : rowData,
      blackPixelsCount: blackPixelsCount,
    };

    if (rowsData.length === 0) {
      rowsData.push(newPart);
    } else {
      var lastPacket = rowsData[rowsData.length - 1];
      var same = newPart.dataType === lastPacket.dataType;

      if (same && newPart.dataType === "pixels") {
        same = u8ArraysEqual(newPart.rowData, lastPacket.rowData);
      }

      if (same) {
        lastPacket.repeat++;
      } else {
        rowsData.push(newPart);
      }

      if (row % 200 === 199) {
        rowsData.push({
          dataType: "check",
          rowNumber: row,
          repeat: 0,
          rowData: undefined,
          blackPixelsCount: 0,
        });
      }
    }
  }

  return { cols: cols, rows: rows, rowsData: rowsData };
}

/**
 * 通过 uni.canvasGetImageData 获取像素数据并编码。
 */
function encodeUniCanvas(canvasId, width, height, printDirection, componentInstance) {
  return new Promise(function (resolve, reject) {
    uni.canvasGetImageData({
      canvasId: canvasId,
      x: 0,
      y: 0,
      width: width,
      height: height,
      success: function (res) {
        try {
          var encoded = encodeImageData(res.data, width, height, printDirection);
          resolve(encoded);
        } catch (e) {
          reject(e);
        }
      },
      fail: function (err) {
        reject(new Error("canvasGetImageData 失败: " + err.errMsg));
      },
    }, componentInstance);
  });
}

module.exports = {
  encodeImageData: encodeImageData,
  encodeUniCanvas: encodeUniCanvas,
};
