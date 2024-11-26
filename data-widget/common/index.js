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

function formatElapsedTime() {
    if (!elapsed) return;
    return padDigits(2, elapsed.getHours()) + ":" + //
        padDigits(2, elapsed.getMinutes()) + ":" + //
        padDigits(2, elapsed.getSeconds()) + "." + //
        padDigits(3, elapsed.getMilliseconds());
}

function incRepCount(value) {
    startDate = new Date();
    history[value - 1] = formatElapsedTime();

    if (value === 1) {
        interval = setInterval(() => {
            elapsed = new Date(new Date() - startDate);
            timer.setProperty(prop.MORE, {
                text: formatElapsedTime()
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

        const viewContainer = createWidget(widget.VIEW_CONTAINER, {
            x: px(0),
            y: px(0),
            w: px(480),
            h: px(480),
            scroll_frame_func(info) {
            },
            scroll_complete_func(info) {
            }
        })

        repCount = viewContainer.createWidget(widget.TEXT, {
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

        timer = viewContainer.createWidget(widget.TEXT, {
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

        startButton = viewContainer.createWidget(widget.BUTTON, {
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
        viewContainer.createWidget(widget.BUTTON, {
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

        viewContainer.createWidget(widget.BUTTON, {
            x: (px(480) - px(400)) / 2,
            y: px(470),
            w: px(400),
            h: px(64),
            radius: px(32),
            normal_color: 0x444444,
            press_color: 0x222222,
            text: "⚙️️",
            text_size: px(36),
            click_func: (button_widget) => {
                const dialog = createModal({
                    content: getText('embreve'),
                    show: true,
                    capsuleButton: ['configure', 'close'],
                    onClick: (keyObj) => {
                        dialog.show(false)
                        console.log('type', keyObj.type)
                        if (keyObj.type === 10) {
                            setTimeout(() => {
                                const d2 = createModal({
                                    content: JSON.stringify(history),
                                    capsuleButton: ['close'],
                                    show: true,
                                    onClick: (keyObj) => d2.show(false)
                                })
                            }, 1)
                        }
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
