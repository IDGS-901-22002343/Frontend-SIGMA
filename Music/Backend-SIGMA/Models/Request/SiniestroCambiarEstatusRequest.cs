using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models.Request
{
    public class SiniestroCambiarEstatusRequest
    {
        [Required]
        public int IdEstatus { get; set; }
    }
}