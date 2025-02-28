<template>
  <div class="chatbot">
    <div class="chat-body" ref="chatBody">
      <div v-for="(message, index) in messages" :key="index" :class="message.type">
        {{ message.text }}
      </div>
    </div>
    <div class="chat-input">
      <input type="text" v-model="userInput" @keyup.enter="sendMessage" placeholder="메시지를 입력하세요..." />
      <button @click="sendMessage" :disabled="isLoading">전송</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInput: "",
      messages: [{ text: "안녕하세요! 김치 배합에 대해 질문해 주세요.", type: "bot" }],
      isLoading: false,
      openAiApiKey: process.env.VUE_APP_OPENAI_API_KEY, // 🔹 OpenAI API 키
      openAiEndpoint: "https://api.openai.com/v1/chat/completions",
      model: "gpt-3.5-turbo",
      retryCount: 0, // 🔹 API 재시도 횟수 추적
      maxRetries: 1, // 🔹 최대 재시도 횟수
    };
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim() || this.isLoading) return;
      this.messages.push({ text: this.userInput, type: "user" });

      const userMessage = this.userInput;
      this.userInput = "";
      this.isLoading = true;
      this.$nextTick(() => this.scrollToBottom());

      setTimeout(async () => {
        await this.callOpenAiApi(userMessage);
      }, 2000); // ✅ API 호출 2초 지연
    },

    async callOpenAiApi(userMessage) {
      try {
        const response = await fetch(this.openAiEndpoint, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.openAiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: this.model,
            messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: userMessage }],
            temperature: 0.7,
          }),
        });

        const data = await response.json();
        console.log("📌 OpenAI API 응답:", data);

        if (data.choices && data.choices.length > 0) {
          this.messages.push({ text: data.choices[0].message.content, type: "bot" });
        } else {
          this.messages.push({ text: "API 응답이 없습니다. 다시 시도해 주세요.", type: "bot" });
        }

        this.retryCount = 0; // ✅ 성공하면 재시도 횟수 초기화

      } catch (error) {
        console.error("🚨 API 요청 실패:", error);

        if (error.response && error.response.status === 429 && this.retryCount < this.maxRetries) {
          console.warn(`⚠️ API Rate Limit 초과, ${this.retryCount + 1}회 재시도`);
          this.retryCount++;
          setTimeout(() => this.callOpenAiApi(userMessage), 5000); // ✅ 5초 후 재시도
        } else {
          this.messages.push({ text: "오류가 발생했습니다. 다시 시도해주세요.", type: "bot" });
          this.retryCount = 0;
        }
      } finally {
        this.isLoading = false;
        this.$nextTick(() => this.scrollToBottom());
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const chatBody = this.$refs.chatBody;
        if (chatBody) {
          chatBody.scrollTop = chatBody.scrollHeight;
        }
      });
    }
  },

  mounted() {
    console.log("🔹 환경 변수 확인:", process.env.VUE_APP_OPENAI_API_KEY);
  }
};
</script>

<style scoped>
.chatbot {
  width: 100%;
  height: 200px;
  background: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-top: 10px;
}
.chat-body {
  flex: 1;
  padding: 6px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  max-height: 150px;
}
.bot, .user {
  padding: 6px;
  border-radius: 4px;
  margin: 3px 0;
}
.bot {
  background: #f1f1f1;
  align-self: flex-start;
}
.user {
  background: #007BFF;
  color: white;
  align-self: flex-end;
}
.chat-input {
  display: flex;
  border-top: 1px solid #ddd;
  padding: 4px;
}
.chat-input input {
  flex: 1;
  padding: 5px;
  border: none;
  outline: none;
  font-size: 14px;
}
.chat-input button {
  padding: 5px 10px;
  background: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 13px;
  border-radius: 5px;
}
.chat-input button:hover {
  background: #0056b3;
}
.chat-input button:disabled {
  background: #aaa;
  cursor: not-allowed;
}
</style>
