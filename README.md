# RMX_SYSTEMS // AUDIO DATABASE

Este é um projeto React profissional desenvolvido para venda e licenciamento de beats e sound kits, com uma estética Sci-Fi/Cyberpunk única.

## 🚀 Funcionalidades Principais

*   **Loja de Beats:** Interface estilo "Database" com prévia de áudio, busca e filtros.
*   **Sound Kits:** Seção visual estilo "Tabela Periódica" para venda de kits de bateria.
*   **Carrinho & Checkout:** Sistema completo de carrinho com checkout via WhatsApp/Pix.
*   **Painel Administrativo:**
    *   Gerenciamento de Beats e Kits.
    *   Sistema de Upload Híbrido (Google Cloud Storage + Fallback Local).
    *   Configuração de Links Sociais e Dados de Pagamento.
*   **Player de Áudio:** Player persistente com controles de loop, volume e visualização de progresso.
*   **Design Responsivo:** Totalmente adaptado para Desktop e Mobile.

## 🛠️ Tecnologias Usadas

*   **Frontend:** React 18, TypeScript, Vite
*   **Estilização:** Tailwind CSS
*   **Ícones:** Lucide React (Componentes Personalizados)
*   **IA:** Integração opcional com Google Gemini para geração de descrições.
*   **Armazenamento:** Google Cloud Storage (com modo de demonstração local).

## 📦 Como Rodar o Projeto

1.  **Instalar Dependências:**
    ```bash
    npm install
    ```

2.  **Rodar Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```

3.  **Build para Produção:**
    ```bash
    npm run build
    ```

## ☁️ Configuração de Nuvem (Opcional)

Para habilitar o upload real de arquivos para a nuvem, configure as seguintes variáveis de ambiente na sua hospedagem (Vercel/Netlify) ou arquivo `.env`:

*   `GOOGLE_CLOUD_PROJECT_ID`
*   `GOOGLE_CLOUD_CLIENT_EMAIL`
*   `GOOGLE_CLOUD_PRIVATE_KEY`
*   `GCS_BUCKET_NAME`

*Nota: Se não configurado, o sistema usará automaticamente o modo LOCAL (armazenamento no navegador) para demonstração.*

## 🔐 Acesso Admin Padrão

*   **Usuário:** `admin`
*   **Senha:** `password`
*   *(Alterável no painel de configurações)*

---
Developed for RMX Beats. System Version 1.0.0
