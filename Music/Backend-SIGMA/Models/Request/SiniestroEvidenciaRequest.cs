using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models.Request
{
    public class SiniestroEvidenciaRequest
    {
        [Required]
        public string ArchivoBase64 { get; set; } = string.Empty;

        public string? Tipo { get; set; } = "FOTO";

        public string? MimeType { get; set; }
    }
}