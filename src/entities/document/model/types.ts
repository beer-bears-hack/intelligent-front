export interface GenerateDocumentRequest {
  session_id: string
  settings: DocumentSettings
}

export interface DocumentSettings {
  include_cover_page: boolean
  signer_name: string
}

export interface GenerateDocumentResponse {
  file_url: string
  generated_at: string
}
