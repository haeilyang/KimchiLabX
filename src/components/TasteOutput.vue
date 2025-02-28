<template>
  <div class="taste-output">
    <h3>맛 프로파일</h3>
    <canvas ref="radarChart"></canvas>
    <div class="warnings">
      <p v-for="(warning, index) in tasteWarnings" :key="index" class="warning-text">
        ⚠️ {{ warning }}
      </p>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  props: {
    ingredients: Array
  },
  data() {
    return {
      baseTasteFactors: {
        "절임배추": { sweetness: 2, saltiness: 6, sourness: 5, umami: 2, spiciness: 1 },
        "무": { sweetness: 6, saltiness: 2, sourness: 2, umami: 1, spiciness: 0 },
        "마늘": { sweetness: 1, saltiness: 3, sourness: 1, umami: 4, spiciness: 3 },
        "생강": { sweetness: 2, saltiness: 1, sourness: 3, umami: 2, spiciness: 6 },
        "고춧가루": { sweetness: 1, saltiness: 2, sourness: 1, umami: 3, spiciness: 9 },
        "대파": { sweetness: 3, saltiness: 1, sourness: 1, umami: 2, spiciness: 2 },
        "양파": { sweetness: 5, saltiness: 1, sourness: 2, umami: 3, spiciness: 1 },
        "쪽파": { sweetness: 2, saltiness: 1, sourness: 1, umami: 3, spiciness: 3 },
        "갓": { sweetness: 1, saltiness: 3, sourness: 3, umami: 2, spiciness: 5 },
        "부추": { sweetness: 3, saltiness: 2, sourness: 2, umami: 3, spiciness: 4 },
        "다시육수": { sweetness: 3, saltiness: 4, sourness: 1, umami: 6, spiciness: 0 },
        "찹쌀풀": { sweetness: 4, saltiness: 1, sourness: 1, umami: 2, spiciness: 0 },
        "멸치액젓": { sweetness: 0, saltiness: 9, sourness: 2, umami: 7, spiciness: 0 },
        "새우젓": { sweetness: 2, saltiness: 8, sourness: 2, umami: 6, spiciness: 0 },
        "황석어젓": { sweetness: 1, saltiness: 9, sourness: 3, umami: 8, spiciness: 0 },
        "갈치젓": { sweetness: 2, saltiness: 8, sourness: 2, umami: 7, spiciness: 0 },
        "정백당": { sweetness: 9, saltiness: 0, sourness: 0, umami: 0, spiciness: 0 },
        "미원": { sweetness: 1, saltiness: 2, sourness: 0, umami: 9, spiciness: 0 }
      },
      variantTasteModifiers: {
        "절임배추": {
          "저염절임": { saltiness: -2, sourness: -1 },
          "고염절임": { saltiness: +2, sourness: +1 }
        },
        "고춧가루": {
          "보통맛": { spiciness: 7 },
          "중간맛": { spiciness: 8 },
          "매운맛": { spiciness: 9 }
        }
      },
      seasonTasteModifiers: {
        "절임배추": {
          "봄작형": { sweetness: +1 },
          "가을작형": { sourness: +1 }
        },
        "무": {
          "봄작형": { sweetness: +2 },
          "겨울작형": { sweetness: +3, sourness: -1 }
        }
      }
    };
  },
  computed: {
    tasteProfile() {
      let totals = { sweetness: 0, saltiness: 0, sourness: 0, umami: 0, spiciness: 0 };

      this.ingredients.forEach(ing => {
        let baseFactor = this.baseTasteFactors[ing.type] || {};
        let variantFactor = this.variantTasteModifiers[ing.type]?.[ing.variant] || {};
        let seasonFactor = this.seasonTasteModifiers[ing.type]?.[ing.season] || {};

        Object.keys(totals).forEach(key => {
          let baseValue = baseFactor[key] || 0;
          let variantValue = variantFactor[key] || 0;
          let seasonValue = seasonFactor[key] || 0;

          totals[key] += (baseValue + variantValue + seasonValue) * (ing.percentage / 100);
        });
      });

      return Object.values(totals).map(val => Math.min(10, val.toFixed(2))); // 0~10 정규화
    },
    tasteWarnings() {
      const labels = ["단맛", "짠맛", "신맛", "감칠맛", "매운맛"];
      return this.tasteProfile
        .map((val, index) => {
          if (val < 2) return `${labels[index]} 값이 너무 낮습니다. (현재: ${val})`;
          if (val > 5) return `${labels[index]} 값이 너무 높습니다. (현재: ${val})`;
          return null;
        })
        .filter(warning => warning !== null);
    }
  },
  mounted() {
    this.renderChart();
  },
  watch: {
    tasteProfile() {
      this.renderChart();
    }
  },
  methods: {
    renderChart() {
      if (this.chart) this.chart.destroy();
      this.chart = new Chart(this.$refs.radarChart, {
        type: "radar",
        data: {
          labels: ["단맛", "짠맛", "신맛", "감칠맛", "매운맛"],
          datasets: [{
            data: this.tasteProfile,
            fill: true,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)"
          }]
        },
        options: {
          plugins: {
            legend: { display: false } // 범례 제거
          },
          scales: {
            r: {
              min: 0,
              max: 10
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.taste-output {
  border: 1px solid #ddd;
  text-align: center;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
canvas {
  max-width: 250px;
  max-height: 250px;
}
.warnings {
  margin-top: 10px;
  padding: 5px;
  text-align: center;
}
.warning-text {
  color: red;
  font-size: 14px;
  font-weight: bold;
}
</style>
