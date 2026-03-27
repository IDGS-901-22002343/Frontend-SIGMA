namespace Backend_SIGMA.Models.DTO
{
    public class SiniestroEvidenciaDTO
    {
        public int IdEvidencia { get; set; }
        public int IdSiniestro { get; set; }
        public string Tipo { get; set; } = "FOTO";
        public string ArchivoBase64 { get; set; } = string.Empty;
        public string? MimeType { get; set; }
        public DateTime FechaSubida { get; set; }
    }
}