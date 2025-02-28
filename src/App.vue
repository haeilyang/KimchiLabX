<template>
  <div class="container">
    <header>
      <h1>KimchiLabX</h1>
    </header>
    <div class="content">
      <div class="left">
        <RecipeForm @submit-recipe="updateRecipe" />
      </div>
      <div class="right">
        <div class="top">
          <NutritionOutput :ingredients="ingredients" />
          <TasteOutput :ingredients="ingredients" />
        </div>
        <div class="bottom">
          <CostOutput :ingredients="ingredients" />
          <ChatBot /> <!-- 단가 계산 아래에 챗봇 배치 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecipeForm from "./components/RecipeForm.vue";
import CostOutput from "./components/CostOutput.vue";
import NutritionOutput from "./components/NutritionOutput.vue";
import TasteOutput from "./components/TasteOutput.vue";
import ChatBot from "./components/ChatBot.vue"; // 챗봇 추가

export default {
  components: {
    RecipeForm,
    CostOutput,
    NutritionOutput,
    TasteOutput,
    ChatBot
  },
  data() {
    return {
      ingredients: []
    };
  },
  methods: {
    updateRecipe(newIngredients) {
      this.ingredients = newIngredients;
    }
  }
};
</script>

<style scoped>
/* Google Fonts */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Noto+Sans+KR:wght@300;400;600&display=swap");

* {
  font-family: "Inter", "Noto Sans KR", sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
header {
  text-align: center;
  background-color: #f8f8f8;
  padding: 10px 0;
  border-bottom: 2px solid #ddd;
}
h1 {
  font-size: 26px;
  font-weight: 600;
  color: #333;
  letter-spacing: 0.5px;
}
.content {
  display: flex;
  flex: 1;
  align-items: flex-start;
}
.left {
  width: 50%;
  padding: 15px;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.right {
  width: 50%;
  display: flex;
  flex-direction: column;
  padding: 15px;
}
.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.top > * {
  width: 48%;
}
.bottom {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px; /* 단가 계산과 챗봇 사이 여백 추가 */
}
</style>
