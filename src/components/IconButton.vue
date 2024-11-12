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

    font-size: 40px;

  }
  
  .label {
    color: #333;
    font-size: 14px;
    font-weight: bold;
  }
  </style>
  