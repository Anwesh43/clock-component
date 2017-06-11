const clockSize = Math.max(window.innerWidth,window.innerHeight)/6
class ClockComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.img = document.createElement('img')
        shadow.appendChild(this.img)
        this.clock = new Clock()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = clockSize
        canvas.height = clockSize
        const context = canvas.getContext('2d')
        this.clock.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        setInterval(()=>{
            this.render()
        },1000)
    }
}
class Clock {
    constructor() {
        this.getTimeAngles()
    }
    getTimeAngles() {
        const date = new Date()
        const hour = date.getHours()%12
        const minute = date.getMinutes()
        const seconds = date.getSeconds()
        this.sa = seconds * 6
        this.ma = minute * 6 + (seconds/60)*6
        this.ha = hour * 30 + (minute/60)*30+(seconds/3600)*30
        console.log(`${hour}:${minute}:${seconds}`)
    }
    drawSecond(context) {
        context.lineWidth = clockSize/100
        context.save()
        context.rotate(this.sa*Math.PI/180)
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(0,-clockSize/5)
        context.stroke()
        context.restore()
    }
    drawMinute(context) {
        context.lineWidth = clockSize/50
        context.save()
        context.rotate(this.ma*Math.PI/180)
        context.beginPath()
        context.moveTo(0,0)
        context.lineTo(0,-clockSize/6)
        context.stroke()
        context.restore()
    }
    drawHour(context) {
      context.lineWidth = clockSize/30
      context.save()
      context.rotate(this.ha*Math.PI/180)
      context.beginPath()
      context.moveTo(0,0)
      context.lineTo(0,-clockSize/8)
      context.stroke()
      context.restore()
    }
    draw(context) {
        context.strokeStyle = 'black'
        context.lineWidth = clockSize/60
        context.lineCap = 'round'
        context.beginPath()
        context.save()
        context.translate(clockSize/2,clockSize/2)
        context.arc(0,0,2*clockSize/5,0,2*Math.PI)
        context.stroke()
        for(var i=0;i<12;i++) {
            context.save()
            context.rotate((i+1)*Math.PI/6)
            context.beginPath()
            context.moveTo(0,-2*clockSize/5)
            context.lineTo(0,-clockSize/3)
            context.stroke()
            const text = ""+(i+1)
            context.font = context.font.replace(/\d{2}/,clockSize/15)
            const tw = context.measureText(text).width
            context.fillText(text,-tw/2,-clockSize/4)
            context.restore()
        }
        this.drawSecond(context)
        this.drawMinute(context)
        this.drawHour(context)
        context.restore()
        this.getTimeAngles()
    }
}
customElements.define('clock-component',ClockComponent)
