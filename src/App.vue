<script setup lang="ts">
import { Layout } from 'ant-design-vue';
import ComponentPanel from './components/layout/ComponentPanel.vue'
import Canvas from './components/layout/Canvas.vue'
import ConfigPanel from './components/layout/ConfigPanel.vue'

const { Sider, Content } = Layout;
</script>

<template>
  <Layout class="layout-container">
    <Sider width="280" class="layout-sider">
      <ComponentPanel />
    </Sider>
    <Content class="layout-content">
      <Canvas />
    </Content>
    <Sider width="300" class="layout-sider right">
      <ConfigPanel />
    </Sider>
  </Layout>
</template>

<style lang="less" scoped>
.layout-container {
  width: 100vw;
  height: 100vh;
  
  .layout-sider {
    background: #fff;
    border-right: 1px solid #f0f0f0;
    
    &.right {
      border-right: none;
      border-left: 1px solid #f0f0f0;
    }
  }
  
  .layout-content {
    background: #fafafa;
    padding: 24px;
  }
}
</style> 