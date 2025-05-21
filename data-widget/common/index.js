import {align, createWidget, prop, text_style, widget} from '@zos/ui'
import {px} from '@zos/utils'
import {getText} from "@zos/i18n";

let dataWidget;
let repCount;

function padDigits(dig, num) {
    return num.toString().padStart(dig, "0");
}

function formatTime(time) {
    if (!time) {
        return "";
    }
    return padDigits(2, time.getHours()) + ":" + //
        padDigits(2, time.getMinutes()) + ":" + //
        padDigits(2, time.getSeconds()) + "." + //
        padDigits(3, time.getMilliseconds());
}

function incRepCount(value) {
    setRepCountText(value);
}

function setRepCountText(value) {
    dataWidget.state.repcount = value;
    repCount.setProperty(prop.MORE, {
        text: value
    });
}

function decRepCount(value) {
    if (value <= 0) {
        value = 0;
    }
    setRepCountText(value);
}

DataWidget({
    state: {
        repcount: 0,
    },
    init() {
        // const bg = createWidget(widget.IMG, {
        //   x: 0,
        //   y: 0,
        //   src: 'bg.png'
        // })
        dataWidget = this;

        repCount = createWidget(widget.TEXT, {
            x: px(0),
            y: px(64),
            w: px(480),
            h: px(96),
            color: 0xffffff,
            text_size: px(96),
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            text_style: text_style.NONE,
        })

        createWidget(widget.TEXT, {
            x: px(0),
            y: px(20),
            w: px(480),
            h: px(54),
            color: 0xffffff,
            text_size: px(22),
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            text_style: text_style.NONE,
            text: getText("rounds"),
        })
        createWidget(widget.BUTTON, {
            x: (px(480) - px(400)) / 2,
            y: px(180),
            w: px(400),
            h: px(96),
            radius: px(24),
            normal_color: 0x444444,
            press_color: 0x222222,
            text: getText("adicionar"),
            text_size: px(36),
            click_func: (button_widget) => {
                incRepCount(++dataWidget.state.repcount)
            }
        })
        createWidget(widget.BUTTON, {
            x: (px(480) - px(400)) / 2,
            y: px(290),
            w: px(400),
            h: px(96),
            radius: px(24),
            normal_color: 0x444444,
            press_color: 0x222222,
            text: getText("remover"),
            text_size: px(36),
            click_func: (button_widget) => {
                decRepCount(--dataWidget.state.repcount)
            }
        })
        setRepCountText(0);
    },

    build() {
        this.init();
    },

    onInit() {
        // console.log("onInit");
    },

    onDestroy() {
        // console.log("onDestroy");
    },

    onResume() {
        // console.log("onResume");
    },

    onPause() {
        // console.log("onPause");
    },
})
