using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    [ApiController]
    [Route("api/upload")]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<UploadController> _logger;

        public UploadController(IWebHostEnvironment env, ILogger<UploadController> logger)
        {
            _env = env;
            _logger = logger;
        }

        [HttpGet("image/{fileName}")]
        public IActionResult GetImage(string fileName)
        {
            var filePath = GetFilePath("images", fileName);
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var contentType = GetContentType(filePath, "image");
            return File(System.IO.File.OpenRead(filePath), contentType, fileName);
        }

        [HttpPost("image")]
        [Produces("application/json")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            if (!IsValidFile(file, "image"))
            {
                return BadRequest($"Invalid file type for file {file.FileName}.");
            }

            try
            {
                var fileName = GenerateFileName(file);
                var filePath = GetFilePath("images", fileName);

                await SaveFileAsync(file, filePath);

                var fileUrl = GenerateFileUrl("images", fileName);
                return Ok(new { Link = fileUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error uploading image {file.FileName}");
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error uploading image {file.FileName}");
            }
        }

        [HttpGet("file/{fileName}")]
        public IActionResult GetFile(string fileName)
        {
            var filePath = GetFilePath("files", fileName);
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var contentType = GetContentType(filePath, "file");
            return File(System.IO.File.OpenRead(filePath), contentType, fileName);
        }

        [HttpPost("file")]
        [Produces("application/json")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            _logger.LogInformation($"Received file - Name: {file.FileName}, MIME Type: {file.ContentType}, Size: {file.Length}");

            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            /*    if (!IsValidFile(file, "file"))
                {
                    _logger.LogError($"Error uploading image {file.FileName}");
                    return BadRequest($"Invalid file type for file {file.FileName}.");
                }*/

            try
            {
                var fileName = GenerateFileName(file);
                var filePath = GetFilePath("files", fileName);

                await SaveFileAsync(file, filePath);

                var fileUrl = GenerateFileUrl("files", fileName);
                return Ok(new { link = fileUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error uploading file {file.FileName}");
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error uploading file {file.FileName}");
            }
        }

        [HttpPost("video")]
        [Produces("application/json")]
        public async Task<IActionResult> UploadVideo(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            if (!IsValidFile(file, "video"))
            {
                return BadRequest($"Invalid file type for file {file.FileName}.");
            }

            try
            {
                var fileName = GenerateFileName(file);
                var filePath = GetFilePath("videos", fileName);

                await SaveFileAsync(file, filePath);

                var fileUrl = GenerateFileUrl("videos", fileName);
                return Ok(new { link = fileUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error uploading video {file.FileName}");
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error uploading video {file.FileName}");
            }
        }

        [HttpGet("video/{fileName}")]
        public IActionResult GetVideo(string fileName)
        {
            var filePath = GetFilePath("videos", fileName);
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var contentType = GetContentType(filePath, "video");
            return File(System.IO.File.OpenRead(filePath), contentType, fileName);
        }

        private string GetFilePath(string type, string fileName) => Path.Combine(_env.WebRootPath, "uploads", type, fileName);

        private async Task SaveFileAsync(IFormFile file, string filePath)
        {
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }

        private string GenerateFileName(IFormFile file) => Guid.NewGuid().ToString().Substring(0, 8) + Path.GetExtension(file.FileName);

        private string GenerateFileUrl(string type, string fileName) => $"{Request.Scheme}://{Request.Host}/uploads/{type}/{fileName}";

        private bool IsValidFile(IFormFile file, string type)
        {
            var validMimeTypes = type switch
            {
                "image" => new[] { "image/gif", "image/jpeg", "image/pjpeg", "image/x-png", "image/png", "image/svg+xml" },
                "file" => new[] { "text/plain", "application/msword", "application/x-pdf", "application/pdf", "application/json", "text/html", "application/x-rar-compressed" },
                "video" => new[] { "video/mp4", "video/webm", "video/ogg" },
                _ => Array.Empty<string>()
            };

            var validExtensions = type switch
            {
                "image" => new[] { ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp" },
                "file" => new[] { ".txt", ".pdf", ".doc", ".json", ".html", ".rar" },
                "video" => new[] { ".mp4", ".webm", ".ogg" },
                _ => Array.Empty<string>()
            };

            var mimeType = file.ContentType;
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            _logger.LogInformation($"Received file - MIME Type: {mimeType}, Extension: {extension}");

            return validMimeTypes.Contains(mimeType) && validExtensions.Contains(extension);
        }

        private string GetContentType(string filePath, string type) => type switch
        {
            "image" => Path.GetExtension(filePath).ToLowerInvariant() switch
            {
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".svg" => "image/svg+xml",
                ".webp" => "image/webp",
                _ => "application/octet-stream"
            },
            "file" => Path.GetExtension(filePath).ToLowerInvariant() switch
            {
                ".txt" => "text/plain",
                ".pdf" => "application/pdf",
                ".doc" => "application/msword",
                ".json" => "application/json",
                ".html" => "text/html",
                ".rar" => "application/x-rar-compressed",
                _ => "application/octet-stream"
            },
            "video" => Path.GetExtension(filePath).ToLowerInvariant() switch
            {
                ".mp4" => "video/mp4",
                ".webm" => "video/webm",
                ".ogg" => "video/ogg",
                _ => "application/octet-stream"
            },
            _ => "application/octet-stream"
        };
    }
}