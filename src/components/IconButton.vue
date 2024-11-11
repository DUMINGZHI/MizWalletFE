<template>
    <div class="icon-button">
      <div class="icon">
        <slot></slot> <!-- 插槽用于插入图标内容 -->
      </div>
      <div class="label">{{ label }}</div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      label: {
        type: String,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .icon-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Arial, sans-serif;
  }
  
  .icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #1a73e8; /* 蓝色背景 */
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    margin-bottom: 5px;
  }
  
  .label {
    color: #333;
    font-size: 14px;
    font-weight: bold;
  }
  </style>
  