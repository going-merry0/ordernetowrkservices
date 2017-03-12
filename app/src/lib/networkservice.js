import { exec } from 'child_process'

const serviceRegexp = /\(\d+\)\s(.*)\s\(Hardware Port:\s(?:.*)?,\sDevice:\s(.*)?\)/g
const macRegexp = /(?:[0-9a-zA-Z]{2}:?){6}/g

export default class NetworkService {
  name = ''
  mac = ''
  device = ''
  active = false

  static async ifconfig() {
    return new Promise((resolve, reject) => {
      exec('ifconfig', (error, stdout) => {
        if (error) {
          reject(error)
          return
        }
        resolve(stdout)
      })
    })
  }

  static async isActive(mac) {
    /* eslint no-useless-escape: 0 */
    let regexp = new RegExp('ether\\s' + mac + '[\\s\\S]*?status:\\s(active|inactive)', 'g')
    let ifcfg = await NetworkService.ifconfig()
    let matches = regexp.exec(ifcfg)
    return matches && matches[1] === 'active'
  }

  static async getMac(device) {
    return new Promise((resolve, reject) => {
      exec(`networksetup -getmacaddress ${device}`, (error, stdout) => {
        if (error) {
          reject(error)
          return
        }
        let matches = stdout.match(macRegexp)
        resolve(matches ? matches[0] : '')
      })
    })
  }

  static async serviceList() {
    return new Promise((resolve, reject) => {
      exec('networksetup -listnetworkserviceorder', (error, stdout) => {
        if (error) {
          reject(error)
          return
        }
        let ret = []
        let matches
        let s
        while (true) {
          matches = serviceRegexp.exec(stdout)
          if (!matches) break

          s = new NetworkService()
          s.name = matches[1]
          s.device = matches[2]
          ret.push(s)
        }
        serviceRegexp.lastIndex = 0
        resolve(ret)
      })
    })
  }

  static async list() {
    let list = await this.serviceList()
    for (let service of list) {
      try {
        service.mac = await this.getMac(service.device)
        service.active = await this.isActive(service.mac)
      } catch (e) {
        service.mac = null
        service.active = false
      }
    }
    return list
  }

  static async setActive(service, on = true) {
    return new Promise((resolve, reject) => {
      exec(`networksetup -setnetworkserviceenabled ${service} ${on ? 'on' : 'off'}`, (error) => {
        if (error) {
          reject(error)
          return
        }
        resolve()
      })
    })
  }

  static async setServicesOrder(services) {
    services = services.map(s => `"${s.name}"`).join(' ')
    console.log(`networksetup -ordernetworkservices ${services}`)
    return new Promise((resolve, reject) => {
      exec(`networksetup -ordernetworkservices ${services}`, (error) => {
        if (error) {
          reject(error)
          return
        }
        resolve()
      })
    })
  }

  async setActive(on = true) {
    await NetworkService.setActive(this.name, on)
  }
}
