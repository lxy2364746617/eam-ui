import store from './../../store';
import router from './../../router';

function sampleData(pcmDatas, pcmSampleRate, newSampleRate, prevChunkInfo = {}) {
  try {
      let index = prevChunkInfo ? prevChunkInfo.index : 0;
      let offset = prevChunkInfo ? prevChunkInfo.offset : 0;
      let size = 0;

      for (let i = index; i < pcmDatas.length; i++) {
          size += pcmDatas[i].length;
      }

      size = Math.max(0, size - Math.floor(offset));
      let step = pcmSampleRate / newSampleRate;
      // 新采样高于录音采样不处理，省去了插值处理，直接抽样
      if (step > 1) {
          size = Math.floor(size / step);
      }
      else {
          step = 1;
          newSampleRate = pcmSampleRate;
      }

      // 准备数据
      let res = new Int16Array(size);
      let idx = 0;
      for (let nl = pcmDatas.length; index < nl; index++) {
          let o = pcmDatas[index];
          let i = offset;
          let il = o.length;
          while (i < il) {
              let before = Math.floor(i);
              let after = Math.ceil(i);
              let atPoint = i - before;
              res[idx] = o[before] + (o[after] - o[before]) * atPoint;
              idx++;
              // 抽样
              i += step;
          }
          offset = i - il;
      }

      return {
          index,
          offset,
          sampleRate: newSampleRate,
          data: res
      };
  }
  catch (error) {
      throw new Error('转音错误了！', error);
  }
};

 function convertBuffer(arrayBuffer) {
  const data = new Float32Array(arrayBuffer);
  const out = new Int16Array(arrayBuffer.length);
  // floatTo16BitPCM
  for (let i = 0; i < data.length; i++) {
      const s = Math.max(-1, Math.min(1, data[i]));
      out[i] = (s < 0 ? s * 0x8000 : s * 0x7FFF);
  }
  return out;
};

// 合并pcm数据
 function encodedPcmBuffer(channelBuffer, sampleRate) {
  const float32array = channelBuffer;
  const float32arrayBuffer = convertBuffer(float32array);
  const Samp = sampleData([float32arrayBuffer], sampleRate, 16000, null);
  return Samp.data;
};

// 控制通道，如下分别为缓冲区大小，输入通道，输出通道
const BUFFER_SIZE = 512;
const INPUT_CHANNELS = 1;
const OUTPUT_CHANNELS = 1;
// 位深默认16
const SAMPLE_SIZE = 16;
// 采样率默认16k
const SAMPLE_RATE = 16 * 1000;
// FFT窗口大小，越大频域更准确而时域相反(时域适合波形，频域适合条形)
const FFT_SIZE = 2048;

const INTERVAL = 20;
const WS_URL = 'ws://172.16.67.90:8083/api/v1/asr/stream';
const DEFAULT_PARAMS = JSON.stringify({
    "enableFlushData": true,
    "productId": "1912",
    "samplePointBytes": 1,
    "sendPerSeconds": INTERVAL / 1000,
    "sleepRatio": 0,
    "appName": "webproxy",
    "userName": "username",
    "password": "password"
});

const FINISH_PARAMS = JSON.stringify({
    "status": "finish"
});

let audioContent;
let websocket;
let output;
let outputMessageArray = [];
let tracks


function startWebSocket(way, afterOpen) {   
    outputMessageArray = []
    websocket && websocket.close();
    websocket = new WebSocket(WS_URL);
    let timer  
    websocket.onopen = function(evt) {
        onOpen(evt, way);
        timer = setInterval(() => {
        websocket.close();
    }, 2000);
    };
    websocket.onclose = function(evt) {
        onClose(evt,way);
        clearInterval(timer); 
        afterOpen()
    };
    websocket.onmessage = function(evt) {
         onMessage(evt,way);
         clearInterval(timer);
         timer = setInterval(() => {
            websocket.close();
        }, 2000);
    }; 
    websocket.onerror = function(evt) {
        onError(evt);
    };
}
export function closetWebSocke(){
    websocket && websocket.close();
}
function onOpen(evt, way, afterOpen) {
    console.log('websocket连接成功',new Date());
    doSend(DEFAULT_PARAMS);
    way === 'upload' && afterOpen();
}

function onClose(evt,way) {
    tracks.forEach(function (track) {
        track.enabled = false;
        track.stop()
    });
    if (outputMessageArray.length > 0) {
        if(way=='知识导航'){
            console.log('知识导航：',outputMessageArray)
        }//知识导航语音
        else{//菜单顶部语音
            console.log('顶部语音：',outputMessageArray)
            const arsMsg = outputMessageArray.map(msg => msg.result).join('')
            if(arsMsg.includes('设备领用')) router.push({ path: '/property/receive',  })
            else if(arsMsg.includes('设备回退')) router.push({ path: '/property/backspace',  })
            else if(arsMsg.includes('设备移交')) router.push({ path: '/property/turnOver',  })
            else if(arsMsg.includes('设备调剂')) router.push({ path: '/property/prescription',  })
            else if(arsMsg.includes('设备报废')) router.push({ path: '/property/scrapping',  })
            else if(arsMsg.includes('位置状态变动')) router.push({ path: '/property/position',  })
            else if(arsMsg.includes('工单请求')) router.push({ path: '/work/request',  })
            else if(arsMsg.includes('工单调度')) router.push({ path: '/work/schedule',  })
            else if(arsMsg.includes('待办任务')) router.push({ path: '/work/quest',  })
            else if(arsMsg.includes('工单记录')) router.push({ path: '/work/record',  })
            else if(arsMsg.includes('工单日历')) router.push({ path: '/work/calendar',  })
            else if(arsMsg.includes('备件列表')) router.push({ path: '/sparepart/spareList',  })
            else if(arsMsg.includes('备件需求')) router.push({ path: '/sparepart/requirement',  })
            else if(arsMsg.includes('备件领用')) router.push({ path: '/sparepart/spareReceive',  })
            else if(arsMsg.includes('备件出入库')) router.push({ path: '/sparepart/spareInAndOut',  })
            else if(arsMsg.includes('巡点检项目')) router.push({ path: '/devops/patrol/item',  })
            else if(arsMsg.includes('巡点检标准')) router.push({ path: '/devops/patrol/pstandard',  })
            else if(arsMsg.includes('巡点检路线')) router.push({ path: '/devops/patrol/pline',  })
            else if(arsMsg.includes('巡点检计划')) router.push({ path: '/devops/patrol/pplan',  })
            else if(arsMsg.includes('保养检修项目')) router.push({ path: '/devops/maintain/mitem',  })
            else if(arsMsg.includes('保养检修标准')) router.push({ path: '/devops/maintain/mstandard',  })
            else if(arsMsg.includes('保养检修路线')) router.push({ path: '/devops/maintain/mline',  })
            else if(arsMsg.includes('保养检修计划')) router.push({ path: '/devops/maintain/mplan',  })
            else if(arsMsg.includes('定期检验计划')) router.push({ path: '/devops/regular/rplan',  })
            else if(arsMsg.includes('故障代码管理')) router.push({ path: '/devops/fault/faultcode',  })
            else if(arsMsg.includes('知识导航')) router.push({ path: '/knowledge/navigation',  })
            else if(arsMsg.includes('故障案例库')) router.push({ path: '/knowledge/faults',  })
            else if(arsMsg.includes('技术资料库')) router.push({ path: '/knowledge/technology',  })
            else if(arsMsg.includes('运维文档库')) router.push({ path: '/knowledge/maintenance',  })
            else if(arsMsg.includes('规章制度库')) router.push({ path: '/knowledge/regulations',  })
            else{
                //设备档案
                window.handleSelect('/decive')
                window.changeActiveMenu('/decive')
                router.push({ path: '/decive/book', query: { msg: arsMsg } })
                setTimeout(() => {
                    speak('搜索中，请稍候')
                }, 1000);
            }
        }    
    }
    console.log('websocket连接关闭', new Date());
}

function onMessage(evt,type) {
    try {
        const data = JSON.parse(evt.data);
        const {serialNum, completed, result} = data;
        if (outputMessageArray.length === 0) {
            outputMessageArray.push(data);
        }
        else {
            const {serialNum: lastSerialNum, completed: lastCompleted} = outputMessageArray[outputMessageArray.length - 1];
            if (serialNum === lastSerialNum && !lastCompleted) {
                outputMessageArray[outputMessageArray.length - 1] = data;
            }
            else {
                outputMessageArray.push(data);
            }
        }
        if(type=='知识导航') store.commit('arsMsg/updateOutputMessage1', outputMessageArray.map(msg => msg.result).join(''));
        else store.commit('arsMsg/updateOutputMessage', outputMessageArray.map(msg => msg.result).join(''));
       
/*         output.innerHTML = `<h4>识别结果：${outputMessageArray.map(msg => msg.result).join('')}</h4>`;
 */        
    }
    catch (error) {
        throw new Error('解析错误!' + error);
    }
}

function onError(evt) {
    throw new Error('websocket连接失败'+ evt.data);
}

function doSend(message) {
    websocket.readyState === 1 && websocket.send(message);
}

function handleAudioprocess(stream) {
    const {inputBuffer} = stream;
    const encodeBuffer = encodedPcmBuffer(inputBuffer.getChannelData(0), inputBuffer.sampleRate);
    // 过滤连续绝对静音的脏数据
    if (encodeBuffer.some(value => value !== 0)) {
        doSend(encodeBuffer);
    }
}

function initAudio(stream) {
    audioContent && audioContent.close();
    const AudioContext = (window.AudioContext || window.webkitAudioContext);
    audioContent = new AudioContext({
        // 由于AudioContext一旦创建采样率不能更改，在创建时设置采样率
        sampleRate: SAMPLE_RATE
    });
    // 创建音频源
    const streamSource = audioContent.createMediaStreamSource(stream);
    // 创建脚本处理器，用于支持音频流采样设置及格式输出
    const scriptProcessor = audioContent.createScriptProcessor(BUFFER_SIZE, INPUT_CHANNELS, OUTPUT_CHANNELS);
    // 连接到AudioNode的输出之一，这里连接到脚本处理器
    streamSource.connect(scriptProcessor);
    scriptProcessor.connect(audioContent.destination);
    // 监听麦克风音频流输出
    scriptProcessor.onaudioprocess = handleAudioprocess;
}

export function startRecorder(way,callback) {
    navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
            sampleRate: SAMPLE_RATE,
            sampleSize: SAMPLE_SIZE,
            channelCount: INPUT_CHANNELS
        }
    }).then(stream => {
        tracks = stream.getAudioTracks();
        startWebSocket(way,callback);
        initAudio(stream);
    }).catch(error => {
        let errorMessage;
        console.log(error)
        switch (error.name) {
            // 用户拒绝
            case 'NotAllowedError':
            case 'PermissionDeniedError':
                errorMessage = '用户已禁止网页调用录音设备';
                break;
            // 未接入录音设备
            case 'NotFoundError':
            case 'DevicesNotFoundError':
                errorMessage = '录音设备未找到';
                break;
            // 其它错误
            case 'NotSupportedError':
                errorMessage = '不支持录音功能';
                break;
            default:
                errorMessage = '录音调用错误';
        }
        throw new Error(errorMessage);
    });
}

// 监听 beforeunload 事件，在刷新或关闭时关闭 AudioContext
window.addEventListener('beforeunload', (event) => {
    audioContent && audioContent.close();
});
function speak(text) {
    const msg = new SpeechSynthesisUtterance(text); // 创建语音消息
    window.speechSynthesis.speak(msg); // 播放语音
  }
    
