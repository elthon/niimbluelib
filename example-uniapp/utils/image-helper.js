/**
 * UniApp 环境下的图像编码辅助工具。
 *
 * 因为 niimbluelib 的 ImageEncoder.encodeCanvas 依赖 HTMLCanvasElement，
 * 而 UniApp 的 canvas 通过 uni.canvasGetImageData 获取像素，
 * 这里提供一个等价的编码函数，直接处理 RGBA 像素数组。
 */

/**
 * 判断像素是否非白色
 * @param {Uint8ClampedArray|Uint8Array} data RGBA 像素数据
 * @param {number} x
 * @param {number} y
 * @param {number} width 原图宽度
 * @param {number} height 原图高度
 * @param {"left"|"top"} printDirection
 */
function isPixelNonWhite(data, x, y, width, height, printDirection) {
  let idx = y * width + x;
  if (printDirection === "left") {
    idx = (height - 1 - x) * width + y;
  }
  idx *= 4;
  return data[idx] !== 255 || data[idx + 1] !== 255 || data[idx + 2] !== 255;
}

function u8ArraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * 将 RGBA 像素数据编码为 EncodedImage（与 niimbluelib 的 ImageEncoder.encodeCanvas 等价）。
 *
 * @param {Uint8ClampedArray|Uint8Array} pixelData RGBA 像素数组 (length = width*height*4)
 * @param {number} width  原始图像宽度
 * @param {number} height 原始图像高度
 * @param {"left"|"top"} printDirection "left" 会顺时针旋转 90°
 * @returns {{ cols: number, rows: number, rowsData: Array }}
 */
export function encodeImageData(pixelData, width, height, printDirection = "left") {
  let cols = width;
  let rows = height;

  if (printDirection === "left") {
    cols = height;
    rows = width;
  }

  if (cols % 8 !== 0) {
    throw new Error(`列数必须是 8 的倍数，当前: ${cols}`);
  }

  const rowsData = [];

  for (let row = 0; row < rows; row++) {
    let isVoid = true;
    let blackPixelsCount = 0;
    const rowData = new Uint8Array(cols / 8);

    for (let colOct = 0; colOct < cols / 8; colOct++) {
      let pixelsOctet = 0;
      for (let colBit = 0; colBit < 8; colBit++) {
        if (isPixelNonWhite(pixelData, colOct * 8 + colBit, row, width, height, printDirection)) {
          pixelsOctet |= 1 << (7 - colBit);
          isVoid = false;
          blackPixelsCount++;
        }
      }
      rowData[colOct] = pixelsOctet;
    }

    const newPart = {
      dataType: isVoid ? "void" : "pixels",
      rowNumber: row,
      repeat: 1,
      rowData: isVoid ? undefined : rowData,
      blackPixelsCount,
    };

    if (rowsData.length === 0) {
      rowsData.push(newPart);
    } else {
      const lastPacket = rowsData[rowsData.length - 1];
      let same = newPart.dataType === lastPacket.dataType;

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

  return { cols, rows, rowsData };
}

/**
 * 通过 uni.canvasGetImageData 获取像素数据并编码。
 *
 * @param {string} canvasId canvas 组件 id
 * @param {number} width
 * @param {number} height
 * @param {"left"|"top"} printDirection
 * @param {object} componentInstance 组件实例 (this)
 * @returns {Promise<{ cols: number, rows: number, rowsData: Array }>}
 */
export function encodeUniCanvas(canvasId, width, height, printDirection, componentInstance) {
  return new Promise((resolve, reject) => {
    uni.canvasGetImageData({
      canvasId,
      x: 0,
      y: 0,
      width,
      height,
      success: (res) => {
        try {
          const encoded = encodeImageData(res.data, width, height, printDirection);
          resolve(encoded);
        } catch (e) {
          reject(e);
        }
      },
      fail: (err) => reject(new Error(`canvasGetImageData 失败: ${err.errMsg}`)),
    }, componentInstance);
  });
}
