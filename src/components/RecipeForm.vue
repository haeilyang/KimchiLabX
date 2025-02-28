<template>
  <div class="recipe-form">
    <div class="header-row">
      <h2>레시피 입력</h2>
      <div class="button-group">
        <button @click="applyRecommendedRatio('중부식김치')" class="recommend-btn">중부식김치</button>
        <button @click="applyRecommendedRatio('남도식김치')" class="recommend-btn">남도식김치</button>
        <button @click="applyRecommendedRatio('숙성김치')" class="recommend-btn">숙성김치</button>
        <button @click="applyRecommendedRatio('외/급식용김치')" class="recommend-btn">외/급식용김치</button>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>재료</th>
          <th>배합비(%)</th>
          <th v-if="hasVariantOption(ingredient?.type)">종류</th>
          <th v-if="hasSeasonOption(ingredient?.type)">작형</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ingredient, index) in ingredients" :key="index">
          <td>{{ ingredient.type || 'N/A' }}</td>
          <td>
            <input type="number" v-model.number="ingredient.percentage" @input="validatePercentage" />
          </td>
          <td v-if="hasVariantOption(ingredient.type)">
            <select v-model="ingredient.variant">
              <option v-for="variant in ingredientOptions[ingredient.type]?.variants || []" :key="variant" :value="variant">
                {{ variant }}
              </option>
            </select>
          </td>
          <td v-if="hasSeasonOption(ingredient.type)">
            <select v-model="ingredient.season">
              <option v-for="season in ingredientOptions[ingredient.type]?.seasons || []" :key="season" :value="season">
                {{ season }}
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>

    <p class="summary">
      현재 배합비 합계: <strong>{{ totalPercentage.toFixed(2) }}%</strong>
      <span v-if="totalPercentage > 100" class="warning"> (100% 초과하였습니다)</span>
      <span v-if="totalPercentage < 100" class="warning"> (100%가 되어야 합니다)</span>
    </p>

    <button @click="submitRecipe" :disabled="totalPercentage !== 100" class="submit-btn">분석하기</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ingredientOptions: {
        "절임배추": { variants: ["저염절임", "기본절임", "고염절임"], seasons: ["봄작형", "여름작형", "가을작형", "겨울작형"] },
        "무": { variants: [], seasons: ["봄작형", "여름작형", "가을작형", "겨울작형"] },
        "마늘": { variants: ["한지마늘", "대서마늘", "남도마늘"], seasons: [] },
        "생강": { variants: [], seasons: [] },
        "고춧가루": { variants: ["보통맛", "중간맛", "매운맛"], seasons: [] },
        "대파": { variants: [], seasons: [] }, "양파": { variants: [], seasons: [] },
        "쪽파": { variants: [], seasons: [] }, "갓": { variants: [], seasons: [] },
        "부추": { variants: [], seasons: [] }, "다시육수": { variants: [], seasons: [] },
        "찹쌀풀": { variants: [], seasons: [] }, "멸치액젓": { variants: [], seasons: [] },
        "새우젓": { variants: [], seasons: [] }, "황석어젓": { variants: [], seasons: [] },
        "갈치젓": { variants: [], seasons: [] }, "정백당": { variants: [], seasons: [] },
        "미원": { variants: [], seasons: [] }
      },
      ingredients: [],
      recommendedRatios: {
        "중부식김치": [60, 10, 5, 2, 6, 3, 5, 1.5, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 1, 0.5],
        "남도식김치": [60, 7, 6, 4, 6, 2, 1, 2, 1.5, 2, 2, 2, 1, 1, 0.5, 0.5, 1, 0.5],
        "숙성김치": [60, 7, 7, 2, 7, 2, 3, 1.5, 1, 1, 1, 1.5, 1, 1, 0.5, 0.5, 2, 1],
        "외/급식용김치": [65, 8, 4, 2, 6, 2, 4, 1, 1, 1, 0.5, 3, 0.3, 0.3, 0.2, 0.2, 1, 0.5]
      }
    };
  },
  created() {
    this.initializeIngredients();
  },
  computed: {
    totalPercentage() {
      return this.ingredients.reduce((sum, ing) => sum + (ing.percentage || 0), 0);
    }
  },
  methods: {
    initializeIngredients() {
      this.ingredients = Object.keys(this.ingredientOptions).map(type => ({
        type,
        variant: this.ingredientOptions[type]?.variants?.[0] || "",
        season: this.ingredientOptions[type]?.seasons?.[0] || "",
        percentage: 0
      }));
    },
    applyRecommendedRatio(type) {
      this.ingredients.forEach((ingredient, index) => {
        ingredient.percentage = this.recommendedRatios[type][index] || 0;
      });
    },
    validatePercentage() {
      // 실시간 배합비 체크
    },
    submitRecipe() {
      if (this.totalPercentage !== 100) return;
      this.$emit("submit-recipe", this.ingredients);
    },
    hasVariantOption(type) {
      return this.ingredientOptions[type]?.variants?.length > 0;
    },
    hasSeasonOption(type) {
      return this.ingredientOptions[type]?.seasons?.length > 0;
    }
  }
};
</script>

<style scoped>
.recipe-form {
  width: 100%;
  padding: 5px;
}
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.button-group {
  display: flex;
  gap: 5px;
}
.recommend-btn {
  padding: 5px 10px;
  background: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
}
.submit-btn {
  width: 100%;
  padding: 12px;
  background: #007BFF;
  color: white;
  font-weight: bold;
  border-radius: 6px;
}
</style>
