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
      hfToken: process.env.VUE_APP_HF_TOKEN, // 🔹 Hugging Face API 키 (테스트용)
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

      try {
        const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-3B", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.hfToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: userMessage }),
        });

        const data = await response.json();
        console.log("📌 Hugging Face API 응답:", data); // 응답 확인용 로그

        // 🔹 응답 구조 확인 후 올바른 키 사용
        if (data.length > 0 && data[0].generated_text) {
          this.messages.push({ text: data[0].generated_text, type: "bot" });
        } else {
          this.messages.push({ text: "API 응답이 없습니다. 다시 시도해 주세요.", type: "bot" });
        }
      } catch (error) {
        console.error("🚨 API 요청 실패:", error);
        this.messages.push({ text: "오류가 발생했습니다. 다시 시도해주세요.", type: "bot" });
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
  }
};
</script>

<style scoped>
.chatbot { width: 100%; height: 200px; background: white; border-radius: 10px; display: flex; flex-direction: column; overflow: hidden; margin-top: 10px; }
.chat-body { flex: 1; padding: 6px; overflow-y: auto; display: flex; flex-direction: column; max-height: 150px; }
.bot, .user { padding: 6px; border-radius: 4px; margin: 3px 0; }
.bot { background: #f1f1f1; align-self: flex-start; }
.user { background: #007BFF; color: white; align-self: flex-end; }
.chat-input { display: flex; border-top: 1px solid #ddd; padding: 4px; }
.chat-input input { flex: 1; padding: 5px; border: none; outline: none; font-size: 14px; }
.chat-input button { padding: 5px 10px; background: #007BFF; color: white; border: none; cursor: pointer; font-size: 13px; border-radius: 5px; }
.chat-input button:hover { background: #0056b3; }
.chat-input button:disabled { background: #aaa; cursor: not-allowed; }
</style>
