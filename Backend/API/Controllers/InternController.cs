using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class InternController : Controller
    {
        // GET: InternController
        public ActionResult Index()
        {
            return View();
        }

        // GET: InternController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: InternController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: InternController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: InternController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: InternController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: InternController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: InternController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
