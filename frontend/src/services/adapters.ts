// services/adapters.ts
export const adaptPageFromBackend = (backendData: any) => {
  return {
    id: backendData.id,
    title: backendData.name, // ваше поле name -> title
    description: "", // нет в backend
    published: true, // предполагаем опубликованной
    content: {
      blocks: backendData.elements || [],
      theme: {
        background: backendData.background || { type: "color", value: "#040404" },
        textColor: "#ffffff", // hardcode, т.к. нет в backend
        accentColor: "#7c6afa" // hardcode
      },
      settings: {
        animations: {
          enabled: false
        }
      }
    }
  };
};