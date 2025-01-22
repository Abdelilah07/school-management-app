class FileService {
  constructor() {
    this.files = JSON.parse(localStorage.getItem('documentFiles') || '[]');
  }

  async uploadFile(file, metadata) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newFile = {
          id: Date.now().toString(),
          name: metadata.title,
          description: metadata.description,
          documentType: metadata.documentType,
          content: reader.result,
          createdTime: new Date().toISOString(),
          fileName: file.name
        };
        
        this.files.push(newFile);
        localStorage.setItem('documentFiles', JSON.stringify(this.files));
        resolve(newFile);
      };
      reader.readAsDataURL(file);
    });
  }

  async listFiles() {
    return this.files;
  }

  async downloadFile(fileId) {
    const file = this.files.find(f => f.id === fileId);
    if (!file) throw new Error('File not found');
    
    // Convert base64 to blob
    const base64Response = await fetch(file.content);
    const blob = await base64Response.blob();
    return blob;
  }
}

export const fileService = new FileService();