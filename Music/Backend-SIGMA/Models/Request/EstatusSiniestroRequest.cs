using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models.Request
{
    public class EstatusSiniestroRequest
    {
        [Required, MaxLength(50)]
        public string Nombre { get; set; } = string.Empty;
    }
}

