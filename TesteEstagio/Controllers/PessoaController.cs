using Microsoft.AspNetCore.Mvc;
using TesteEstagio.Models;

namespace TesteEstagio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoaController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<Pessoa> Get()
        {
            return new List<Pessoa>();
        }
    }
}
