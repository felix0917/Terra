/**
 * Event事件类
 */
class Event {
  // 中间仓库
  constructor() {
    this.eventTypeObj = {};
    this.cacheObj = {};
  }

  // 发布者
  fire() {
    let eventType = Array.prototype.shift.call(arguments);
    let args = arguments; 
    let that = this;

    if (!this.cacheObj[eventType]) 
      this.cacheObj[eventType] = [];

    cache(); 

    this.cacheObj[eventType].push(cache);

    function cache() {
      if (that.eventTypeObj[eventType]) {
        let eventList = that.eventTypeObj[eventType];
        eventList.forEach(f => {
          f.apply(f, args);
        });
      }
    }
  }

  // 订阅者
  on(eventType, fn) {
    if (!this.eventTypeObj[eventType]) 
      this.eventTypeObj[eventType] = [];

    this.eventTypeObj[eventType].push(fn); 

    if (this.cacheObj[eventType]) {
      let eventCacheList = this.cacheObj[eventType];
      eventCacheList.forEach(f => f());
    }
  }

  // 取消订阅
  off(eventType, fn) {
    let eventTypeList = this.eventTypeObj[eventType];
    if (!eventTypeList)
      return false;

    if (!fn) {
      eventTypeList && (eventTypeList.length = 0);
    } else {
      for (let i = 0; i < eventTypeList.length; i++) {
        if (eventTypeList[i] === fn) {
          eventTypeList.splice(i, 1);
          i--;
        }
      }
    }
  }
}

export default Event;