import {align, createWidget, prop, px, text_style, widget} from '@zos/ui'
import {getText} from "@zos/i18n";
import {createModal} from "@zos/interaction";


let dataWidget;
let repCount;
let startButton;
let timer;
let startDate;
let interval;
let elapsed;
let history = {};

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
    startDate = new Date();
    history[value - 1] = formatTime(elapsed);

    if (value === 1) {
        interval = setInterval(() => {
            elapsed = new Date(new Date() - startDate);
            timer.setProperty(prop.MORE, {
                text: formatTime(elapsed)
            });
        }, 80);
        startButton.setProperty(prop.MORE, {
            x: (px(480) - px(400)) / 2,
            y: px(240),
            w: px(400),
            h: px(96),
            text: getText("adicionar")
        });
    }

    setRepCountText(value);
}

function setRepCountText(value) {
    dataWidget.state.repcount = value;
    repCount.setProperty(prop.MORE, {
        text: getText("rounds") + ': ' + value
    });
}

function decRepCount(value) {
    if (value <= 0) {
        clearInterval(interval)
        value = 0;
        startButton.setProperty(prop.MORE, {
            x: (px(480) - px(400)) / 2,
            y: px(240),
            w: px(400),
            h: px(96),
            text: getText("iniciar"),
        });
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
            y: px(82),
            w: px(480),
            h: px(85),
            color: 0xffffff,
            text_size: px(30),
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            text_style: text_style.NONE,
        })

        timer = createWidget(widget.TEXT, {
            x: px(0),
            y: px(82),
            w: px(480),
            h: px(156),
            color: 0xffffff,
            text_size: px(16),
            text: '00:00:00.000',
            align_h: align.CENTER_H,
            align_v: align.CENTER_V,
            text_style: text_style.NONE,
        })

        startButton = createWidget(widget.BUTTON, {
            x: (px(480) - px(400)) / 2,
            y: px(240),
            w: px(400),
            h: px(96),
            radius: px(48),
            normal_color: 0x444444,
            press_color: 0x222222,
            text: getText("iniciar"),
            click_func: (button_widget) => {
                incRepCount(++dataWidget.state.repcount)
            }
        })
        createWidget(widget.BUTTON, {
            x: (px(480) - px(400)) / 2,
            y: px(350),
            w: px(400),
            h: px(72),
            radius: px(36),
            normal_color: 0x444444,
            press_color: 0x222222,
            text: getText("remover"),
            click_func: (button_widget) => {
                decRepCount(--dataWidget.state.repcount)
            }
        })

        createWidget(widget.BUTTON, {
            x: (px(480) - px(400)) / 2,
            y: px(470),
            w: px(400),
            h: px(64),
            radius: px(32),
            normal_color: 0x444444,
            press_color: 0x222222,
            text: "⚙️️",
            text_size: px(32),
            click_func: (button_widget) => {
                const dialog = createModal({
                    content: Object.entries(history).map(value => {
                        if (value[0] > 0) {
                            return value[0] + ' : ' + value[1]
                        }
                    }).filter(value => value).join('\n'),
                    show: true,
                    capsuleButton: ['close'],
                    onClick: (keyObj) => {
                        dialog.show(false)
                        console.log('type', keyObj.type)
                    }
                });
            }
        });
        setRepCountText(0);
    },

    build() {
        this.init();

        // onWristMotion({
        //     callback: (data = {}) => {
        //         const {motion} = data
        //         this.state.logger.log('motion', motion)
        //         // text.setProperty(prop.MORE, {
        //         //     text: `MOTION:${motion}`
        //         // })
        //     }
        // })
    },
    onInit() {
    },

    onDestroy() {
    }
})
