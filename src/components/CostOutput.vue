<template>
  <div class="cost-output">
    <h4>예상 단가: {{ totalCost.toFixed(2) }} 원 
      <button class="detail-btn" @click="showDetails = true">자세히 ></button>
    </h4>

    <!-- 모달 창 -->
    <div v-if="showDetails" class="modal-overlay" @click="showDetails = false">
      <div class="modal-content" @click.stop>
        <h3>상세 단가 정보</h3>
        <table>
          <thead>
            <tr>
              <th>재료</th>
              <th>배합비(%)</th>
              <th>원가(원/kg)</th>
              <th>최종 원가(원)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in costData" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.percentage }}%</td>
              <td>{{ item.unitPrice.toLocaleString() }} 원/kg</td>
              <td>{{ (item.percentage / 100 * item.unitPrice).toFixed(2).toLocaleString() }} 원</td>
            </tr>
          </tbody>
        </table>
        <button class="close-btn" @click="showDetails = false">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ingredients: Array
  },
  data() {
    return {
      unitPrices: {
        "절임배추": 600, "무": 500, "마늘": 7000, "생강": 8000, "고춧가루": 15000,
        "대파": 3000, "양파": 2500, "쪽파": 3500, "갓": 4500, "부추": 4000,
        "다시육수": 5000, "찹쌀풀": 3000, "멸치액젓": 7000, "새우젓": 9000,
        "황석어젓": 11000, "갈치젓": 12000, "정백당": 2000, "미원": 3000
      },
      showDetails: false
    };
  },
  computed: {
    costData() {
      return this.ingredients.map(ing => ({
        name: ing.type,
        percentage: ing.percentage,
        unitPrice: this.unitPrices[ing.type] || 0
      }));
    },
    totalCost() {
      return this.costData.reduce((sum, item) => sum + (item.percentage / 100 * item.unitPrice), 0);
    }
  }
};
</script>

<style scoped>
.cost-output {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 5px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

h4 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

/* 자세히 버튼 스타일 */
.detail-btn {
  padding: 5px 12px;
  background: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  transition: background 0.2s;
}
.detail-btn:hover {
  background: #0056b3;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 60%;
  max-width: 500px;
  text-align: center;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
}
.close-btn {
  margin-top: 10px;
  padding: 5px 10px;
  background: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
}
.close-btn:hover {
  background: #b02a37;
}

/* 테이블 스타일 */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
th {
  background: #f4f4f4;
}
</style>
