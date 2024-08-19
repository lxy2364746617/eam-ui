<template>
  <div class="homePageContainer" ref="bgBox">
    <div class="homeBg" ref="boxRefFat"></div>
    <div ref="boxRef" class="homePage">
      <div class="top">
        <div class="top-left">
          <span class="full" @click="treeFullscreen(false)"></span>
          <span class="ret" @click="treeFullscreen(true)"></span>
        </div>
        <span>{{ $route.meta.title }}</span>
        <div class="top-right">
          <span class="top-time">{{ formattedTime }}</span>
        </div>
      </div>

      <div class="nav">
        <!-- 1 -->
        <div class="nav-left">
          <!-- 1 -->
          <div
            class="boder"
            style="width: 100%; height: 251px; margin-bottom: 30px"
          >
            <div class="boder-title">工单事态分析</div>
            <div style="width: 100%; height: 220px">
              <One></One>
            </div>
          </div>
          <!-- 2 -->
          <div
            class="boder"
            style="width: 100%; height: 350px; margin-bottom: 30px"
          >
            <div class="boder-title">工单覆盖统计</div>
            <div style="width: 100%; height: 320px; padding-top: 20px">
              <div class="two-top">
                <div>
                  <img src="../../assets/images/largeScreen/month.png" alt="" />
                  <span class="text"><i>80%</i><span>本月覆盖率</span></span>
                </div>
                <div>
                  <img src="../../assets/images/largeScreen/year.png" alt="" />
                  <span class="text"><i>93%</i><span>本年覆盖率</span></span>
                </div>
              </div>
              <div style="width: 100%; height: 220px"><Two></Two></div>
            </div>
          </div>
          <!-- 3 -->
          <div
            class="boder"
            style="width: 100%; height: 261px; margin-bottom: 30px"
          >
            <div class="boder-title" style="margin-bottom: 10px">
              工单事态分析
            </div>
            <div style="width: 100%; height: 220px">
              <Three></Three>
            </div>
          </div>
          <!--  -->
        </div>
        <!-- 2 -->
        <div class="nav-center">
          <div class="bgc"></div>
          <div class="bgc2"></div>
          <div class="bgc3"></div>
          <div style="width: 100%; height: 700px">
            <Map></Map>
          </div>
          <div class="boder" style="width: 100%; height: 228px">
            <div class="boder-title" style="margin-bottom: 10px">
              工单事态分析
            </div>
            <el-radio-group class="radioBtn" v-model="radio4" size="mini">
              <el-radio-button :label="1">完好率</el-radio-button>
              <el-radio-button :label="2">待修率</el-radio-button>
              <el-radio-button :label="3">故障率</el-radio-button>
            </el-radio-group>
            <div
              v-if="radio4"
              style="width: 100%; height: 196px; padding-top: 20px"
            >
              <Seven></Seven>
            </div>
          </div>
        </div>
        <!-- 3 -->
        <div class="nav-right">
          <!-- ritht-1 -->
          <div
            class="boder"
            style="width: 100%; height: 150px; margin-bottom: 25px"
          >
            <div class="boder-title">设备知识管理</div>
            <div style="width: 100%; height: 100px; padding-top: 20px">
              <div class="two-top">
                <div>
                  <img
                    src="../../assets/images/largeScreen/right-icon1.png"
                    alt=""
                  />
                  <span class="text"
                    ><span><i>618</i>条</span><span>设备知识库</span></span
                  >
                </div>
                <div>
                  <img
                    src="../../assets/images/largeScreen/right-icon2.png"
                    alt=""
                  />
                  <span class="text"
                    ><span><i>259</i>条</span><span>维修故障库</span></span
                  >
                </div>
              </div>
            </div>
          </div>
          <!-- ritht-2 -->
          <div
            class="boder"
            style="width: 100%; height: 215px; margin-bottom: 25px"
          >
            <div class="boder-title">设备类别分析</div>
            <div style="width: 100%; height: 171px; padding-top: 20px">
              <Four></Four>
            </div>
          </div>
          <!-- ritht-3 -->
          <div
            class="boder"
            style="width: 100%; height: 215px; margin-bottom: 30px"
          >
            <div class="boder-title">设备年限统计</div>
            <div style="width: 100%; height: 175px; padding-top: 20px">
              <Five></Five>
            </div>
          </div>
          <!-- ritht-4 -->
          <div class="boder" style="width: 100%; height: 262px">
            <div class="boder-title">备件分析</div>
            <div style="width: 100%; height: 240px; padding-top: 20px">
              <Six></Six>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import One from "./echarts/one";
import Two from "./echarts/two";
import Three from "./echarts/three";
import Four from "./echarts/four";
import Five from "./echarts/five";
import Six from "./echarts/six";
import Seven from "./echarts/seven";
import Map from "./echarts/map";
import { setScaleResize } from "@/utils/setScale";
export default {
  components: { One, Two, Three, Four, Five, Six, Seven, Map },
  data() {
    return {
      scale: null,
      formattedTime: this.getCurrentFormattedTime(),
      intervalId: null,
      scaleDpStyle: {},
      radio4: 1,
      target: null,
    };
  },
  mounted() {
    this.handleScaleDomStyle();
    this.intervalId = setInterval(this.updateFormattedTime, 1000);
    this.target = this.$refs.bgBox;
    this.scale = setScaleResize({
      boxRef: this.$refs.boxRef,
      relativeRef: this.$refs.bgBox,
    });
    // 去凭放大监听
    document.addEventListener("fullscreenchange", this.handleFullscreenChange);
    document.addEventListener(
      "webkitfullscreenchange",
      this.handleFullscreenChange
    );
    document.addEventListener(
      "mozfullscreenchange",
      this.handleFullscreenChange
    );
    document.addEventListener(
      "msFullscreenElement",
      this.handleFullscreenChange
    );
  },

  computed: {},
  methods: {
    handleFullscreenChange() {
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      ) {
        setTimeout(() => {
          this.scale = setScaleResize({
            boxRef: this.$refs.boxRef,
          });
        }, 200);
      } else {
        // 用户按下ESC键退出全屏
        setTimeout(() => {
          this.scale = setScaleResize({
            boxRef: this.$refs.boxRef,
            relativeRef: this.$refs.bgBox,
          });
        }, 200);
      }
    },
    treeFullscreen(type) {
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      ) {
        if (!type) return;
        // 关闭全屏
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (type) return;
        // 全屏
        if (this.target.requestFullscreen) {
          this.target.requestFullscreen();
        } else if (this.target.webkitRequestFullscreen) {
          this.target.webkitRequestFullscreen();
        } else if (this.target.msRequestFullscreen) {
          this.target.msRequestFullscreen();
        } else if (this.target.mozRequestFullScreen) {
          this.target.mozRequestFullScreen();
        }
      }
    },

    handleScaleDomStyle() {
      console.log("========================", 13213);
      const scale_width = window.innerWidth - 206;
      const scale_height = window.innerHeight - 111;
      this.scaleDpStyle = {
        width: scale_width,
        height: scale_height,
        // position: "relative",
        // marginTop: 70,
      };
    },
    updateFormattedTime() {
      this.formattedTime = this.getCurrentFormattedTime();
    },
    getCurrentFormattedTime() {
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is zero-based
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
    document.removeEventListener(
      "fullscreenchange",
      this.handleFullscreenChange
    );
    document.removeEventListener(
      "webkitfullscreenchange",
      this.handleFullscreenChange
    );
    document.removeEventListener(
      "mozfullscreenchange",
      this.handleFullscreenChange
    );
    document.removeEventListener(
      "MSFullscreenChange",
      this.handleFullscreenChange
    );
    window.removeEventListener("resize", this.scale);
  },
};
</script>
<style lang='scss' scoped>
.homePageContainer {
  width: 100%;
  position: relative;
  height: calc(100vh - 111px);
}
.homeBg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #000;
}
// 前台可视化界面
.homePage {
  // height: 100vh;
  // width: 100vw;
  min-height: 1080px;
  display: flex;
  flex-direction: column;
  color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: 0 0;
  transition: 0.3s;
  background: url("../../assets/images/largeScreen/bg.png") no-repeat;

  // 全局滚动条
  * {
    &::-webkit-scrollbar {
      width: 8px;
      height: 10px;
    }
    &::-webkit-scrollbar-track {
      border: none;
      // background-color: #333;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #3f8df3;
      border-radius: 8px;
    }
  }
  .top {
    height: 104px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: url("../../assets/images/largeScreen/nav-top.png") no-repeat;
    padding-top: 22px;
    position: relative;
    > span {
      color: #fff;
      letter-spacing: 18px;
      font-family: "PangMenZhengDao";
      font-size: 36px;
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      top: 22px;
    }
    .top-left {
      height: 100%;

      padding-left: 55px;
      padding-top: 10px;
      .full {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url("../../assets/images/largeScreen/full.png") no-repeat;
        margin-right: 15px;
        cursor: pointer;
      }
      .ret {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url("../../assets/images/largeScreen/ret.png") no-repeat;
        cursor: pointer;
      }
    }
    .top-right {
      height: 100%;
      padding: 15px 61px 0 0;
      display: flex;
      flex-direction: row-reverse;
      font-size: 20px;
      .top-time {
        padding-left: 65px;
      }
    }
  }
  .nav {
    height: calc(100% - 104px);
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px 55px 35px;
    // position: relative;
    .nav-left {
      width: 410px;
      //   background-color: red;
    }
    .nav-center {
      display: flex;
      flex-direction: column;
      width: 953px;
      flex: 1;
      margin: 0 30px;
      padding-bottom: 10px;
      .radioBtn {
        position: absolute;
        right: 50px;
        top: 30px;
        z-index: 5;
        ::v-deep
          .el-radio-button__orig-radio:checked
          + .el-radio-button__inner {
          color: #007bfe;
          background-color: transparent;
        }
        ::v-deep .el-radio-button__inner {
          color: #fff;
          background-color: transparent;
        }
      }
      .bgc,
      .bgc2,
      .bgc3 {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 860px;
        height: 860px;
        background: url("../../assets/images/largeScreen/bgc.png") no-repeat;
        background-size: 100% 100%;
        animation: spinBgc 60s linear infinite;
      }
      .bgc2 {
        background: url("../../assets/images/largeScreen/bgc2.png") no-repeat;
        background-size: 100% 100%;
        width: 712px;
        height: 712px;
        animation: spinBgc2 60s linear infinite;
      }
      .bgc3 {
        background: url("../../assets/images/largeScreen/bgc3.png") no-repeat;
        background-size: 100% 100%;
        width: 920px;
        height: 920px;
        animation: spinBgc3 60s linear infinite;
      }
      .boder {
        z-index: 5;
        &::after {
          content: "";
          display: inline-block;
          position: absolute;
          width: 100%;
          height: 67px;
          left: 0;
          top: -26px;
          background: url("../../assets/images/largeScreen/top-center.png")
            no-repeat;
          background-size: 100% 100%;
        }
        .boder-title {
          padding-left: 70px;
          position: relative;
          text-align: left;
          color: #fff;
          font-family: "PangMenZhengDao";
          font-size: 20px;
          font-style: normal;
          font-weight: 400;
          letter-spacing: 6px;
          z-index: 4;
        }
        &::before {
          content: "";
          display: inline-block;
          position: absolute;
          width: 100%;
          height: 15px;
          left: 0;
          bottom: -5px;
          background: url("../../assets/images/largeScreen/bottom-center.png")
            no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .nav-right {
      width: 410px;
      .two-top {
        > div {
          margin-right: 0;
          img {
            width: 70px;
            height: 56px;
          }

          .text {
            display: flex;
            flex-direction: column-reverse;
            i {
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
  .boder {
    position: relative;
    &::after {
      content: "";
      display: inline-block;
      position: absolute;
      width: 100%;
      height: 67px;
      left: 0;
      top: -26px;
      background: url("../../assets/images/largeScreen/top.png") no-repeat;
      background-size: 100% 100%;
    }
    &::before {
      content: "";
      display: inline-block;
      position: absolute;
      width: 100%;
      height: 15px;
      left: 0;
      bottom: -6px;
      background: url("../../assets/images/largeScreen/bottom.png") no-repeat;
      background-size: 100% 100%;
    }

    .boder-title {
      position: relative;
      text-align: center;
      color: #fff;
      font-family: "PangMenZhengDao";
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      letter-spacing: 6px;
      z-index: 4;
    }
    .two-top {
      height: 80px;
      display: flex;
      justify-content: space-around;
      > div {
        img {
          width: 56px;
          height: 56px;
        }
        display: flex;
        justify-content: start;
        align-items: center;
        margin-right: 20px;
        .text {
          display: flex;
          flex-direction: column;
          i {
            color: #e6f7ff;

            text-align: center;
            font-family: "Manrope";
            font-size: 28px;
            font-style: normal;
            font-weight: 600;
            line-height: 137.1%; /* 38.388px */
          }
          > span {
            color: #c0e1ff;
            font-family: "PuHuiTi";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 14px; /* 100% */
            padding-left: 10px;
          }
        }
      }
    }
  }
  @keyframes spinBgc {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  @keyframes spinBgc2 {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(-360deg);
    }
  }

  @keyframes spinBgc3 {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(720deg);
    }
  }
}
</style>
