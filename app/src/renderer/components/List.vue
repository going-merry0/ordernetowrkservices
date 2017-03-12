<template>
<div id="services">
  <ul v-sortable="{ animation: 200, onStart: onStart, onUpdate: onUpdate }" ref="sortable">
    <li v-for="s in list" :key="s.mac">
      <div class="title">{{ s.name }}</div>
      <div class="sub-title">
        <div>Device: {{ s.device }}</div>
        <div>MAC: {{ s.mac ? s.mac : 'Unable to resolve' }}</div>
        <div :class="{active: s.active, inactive: !s.active}">
          static: <span>{{ s.active ? 'active' : 'inactive' }}</span>
        </div>
      </div>
    </li>
  </ul>

  <hsy-dialog class="alert" v-model="alertVisible">
    <div slot="title">{{ alertTitle }}</div>
    <div slot="body" style="width: 220px;">
      {{ alertMsg }}
    </div>
  </hsy-dialog>
</div>
</template>

<script>
import NetworkService from '../../lib/networkservice'

export default {
  data() {
    return {
      alertVisible: false,
      alertTitle: '',
      alertMsg: '',
      list: [],
      old: []
    }
  },
  computed: {
    sortable() {
      return this.$refs.sortable.sortableIns
    }
  },
  methods: {
    loadList() {
      NetworkService.list().then(list => {
        this.list = list
      }).catch(e => {
        this.alertTitle = '🤣 Oops'
        this.alertMsg = `Unable to load service list: ${e}`
        this.alertVisible = true
      })
    },
    onStart() {
      this.old = this.sortable.toArray().slice()
    },
    onUpdate(evt) {
      let ne = this.list.slice(0)
      ne.splice(evt.newIndex, 0, ne.splice(evt.oldIndex, 1)[0])
      NetworkService.setServicesOrder(ne).then(() => {
        this.list = ne
        this.$message({
          type: 'success',
          message: 'This operation succeeds.'
        })
      }).catch(e => {
        this.sortable.sort(this.old)
        this.alertTitle = '🤣 Oops'
        this.alertMsg = `Unable to set services order: ${e}`
        this.alertVisible = true
      })
    }
  },
  mounted() {
    this.loadList()
  }
}
</script>

<style>
#services {
  font-size: 1.3rem;
}

#services ul li {
  padding-left: 20px;
  padding-right: 8px;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 10px 8px 10px 28px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05)
}

#services ul li .title {
  margin-bottom: 10px;
}

#services ul li .sub-title>div {
  display: inline-block;
  color: #999;
  margin-right: 10px;
}

#services ul li .sub-title>div.inactive span {
  color: #CD212B;
}

#services ul li .sub-title>div.active span {
  color: #28CA42;
}
</style>
