using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models
{
    public class SiniestroEvidencia
    {
        [Key]
        public int IdEvidencia { get; set; }

        public int IdSiniestro { get; set; }
        public Siniestro Siniestro { get; set; }

        [MaxLength(30)]
        public string Tipo { get; set; } = "FOTO";

        [Required]
        public string ArchivoBase64 { get; set; }

        [MaxLength(50)]
        public string? MimeType { get; set; }

        public DateTime FechaSubida { get; set; } = DateTime.Now;
    }
}
