// Google Drive API endpoints
const API_BASE_URL = 'https://www.googleapis.com/drive/v3';
const CLIENT_ID = '658240952994-mt90075v54oa25fluafeeja5lrur4g6l.apps.googleusercontent.com';

class DriveService {
  constructor() {
    this.accessToken = null;
  }

  async initialize() {
    try {
      // Load the Google API client library
      await this.loadGoogleAPI();
      await this.authenticate();
    } catch (error) {
      console.error('Error initializing Drive service:', error);
      throw error;
    }
  }

  loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', async () => {
          try {
            await window.gapi.client.init({
              clientId: CLIENT_ID,
              scope: 'https://www.googleapis.com/auth/drive.file',
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  async authenticate() {
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
    }
    this.accessToken = authInstance.currentUser.get().getAuthResponse().access_token;
  }

  async uploadFile(file, metadata) {
    try {
      // First, create the file metadata
      const fileMetadata = {
        name: metadata.title,
        description: metadata.description,
        properties: {
          documentType: metadata.documentType,
        },
      };

      // Create a new multipart form data
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
      form.append('file', file);

      const response = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: form,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async listFiles() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/files?fields=files(id,name,description,properties,webViewLink,createdTime)&orderBy=createdTime desc&pageSize=50`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      return data.files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  async downloadFile(fileId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/files/${fileId}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Download failed');
      }

      return await response.blob();
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }
}

export const driveService = new DriveService();