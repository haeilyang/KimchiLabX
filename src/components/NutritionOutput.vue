<template>
  <div class="nutrition-output">
    <h3>영양정보</h3>
    <table>
      <thead>
        <tr>
          <th>성분</th>
          <th>총량</th>
          <th>1일 기준치 대비 (%)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) in totalNutrition" :key="key">
          <td>{{ nutritionLabels[key] }}</td>
          <td>{{ formatValue(value) }}</td>
          <td>{{ getDailyValuePercent(key, value) }}%</td>
        </tr>
      </tbody>
    </table>
    <p class="footnote">※ 1일 영양성분 기준치(%)는 2,000kcal 기준이며, 개인의 필요 열량에 따라 다를 수 있습니다.</p>
  </div>
</template>

<script>
export default {
  props: {
    ingredients: Array
  },
  data() {
    return {
      nutritionFactors: {
        "절임배추": { carbs: 5, sugar: 1, protein: 1, fat: 0.1, sodium: 50 },
        "무": { carbs: 6, sugar: 2, protein: 1, fat: 0.2, sodium: 30 },
        "마늘": { carbs: 33, sugar: 2, protein: 6, fat: 0.5, sodium: 5 },
        "고춧가루": { carbs: 55, sugar: 1, protein: 12, fat: 15, sodium: 10 },
        "멸치액젓": { carbs: 1, sugar: 0, protein: 10, fat: 1, sodium: 2500 },
        "새우젓": { carbs: 3, sugar: 0, protein: 12, fat: 2, sodium: 3000 }
      },
      dailyValues: {
        carbs: 300, // g/day
        sugar: 50, // g/day
        protein: 50, // g/day
        fat: 65, // g/day
        sodium: 2000 // mg/day
      },
      nutritionLabels: {
        carbs: "탄수화물",
        sugar: "당류",
        protein: "단백질",
        fat: "지방",
        sodium: "나트륨"
      }
    };
  },
  computed: {
    totalNutrition() {
      let totals = { carbs: 0, sugar: 0, protein: 0, fat: 0, sodium: 0 };

      this.ingredients.forEach(ing => {
        let factor = this.nutritionFactors[ing.type] || {};
        Object.keys(totals).forEach(key => {
          totals[key] += (factor[key] || 0) * (ing.percentage / 100);
        });
      });

      return totals;
    }
  },
  methods: {
    formatValue(value) {
      return value >= 1 ? `${value.toFixed(1)} g` : `${(value * 1000).toFixed(0)} mg`;
    },
    getDailyValuePercent(key, value) {
      if (this.dailyValues[key]) {
        return ((value / this.dailyValues[key]) * 100).toFixed(0);
      }
      return "-";
    }
  }
};
</script>

<style scoped>
.nutrition-output {
  border: 1px solid #ddd;
  padding: 15px;
  margin: 5px;
  background-color: white;
  color: black;
  font-family: Arial, sans-serif;
}
h3 {
  text-align: center;
  margin-bottom: 10px;
  font-size: 18px;
}
table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  color: black;
}
th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}
th {
  background-color: #f4f4f4;
  color: black;
  font-weight: bold;
}
.footnote {
  font-size: 12px;
  margin-top: 5px;
  text-align: center;
  color: #555;
}
</style>
