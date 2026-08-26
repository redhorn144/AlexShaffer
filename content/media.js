/* ============================================================================
   media.js — simulation clips.

   These appear in two places:
     • the right-hand rail on the Home tab  (entries with `featured: true`)
     • the Gallery tab                      (all entries, in this order)

   Each entry is either a VIDEO or an IMAGE:

     video →  mp4: "files/media/name.mp4"     (required)
              webm: "files/media/name.webm"   (optional, smaller — used first)
              poster: "files/media/name.jpg"  (optional but recommended)

     image →  image: "files/media/figure.png"

   The entries below point at the placeholder animations in assets/img/ so you
   can see the layout working. Replace them with your own clips — see
   files/media/README.md for the ffmpeg commands that produce web-ready files.
   ========================================================================== */

window.MEDIA = [

  {
    id: "cavity-re100",
    title: "Lid-Driven Cavity, Re = 100",

    // One short line under the player. Method, code, or parameters.
    caption: "Least squares RBF partition of unity",

    // WebM is tried first (smaller); browsers that can't play it fall back
    // to the MP4. The poster shows while the video loads.
    webm: "files/media/cavity_Re100.webm",
    mp4: "files/media/cavity_Re100.mp4",
    poster: "files/media/cavity_Re100.jpg",

    // The source is 594x550, so give the frame that shape rather than
    // letterboxing it into the default 16:9.
    aspect: "594 / 550",

    // Describes the picture for screen readers and when media fails to load.
    // Say what is shown, not "a video of...".
    alt: "Visualization of a incompressile lid-driven cavity flow at Reynolds number 100, showing the primary vortex developing",

    // Show this one in the Home rail. Leave it out to keep it Gallery-only.
    featured: true,

    // Longer text, shown on the Gallery tab only. Optional.
    description: `A visualization of the incompressible lid-driven cavity flow at Reynolds number 100. The simulation was performed using a high order least-squarers radial basis function partition of unity method (RBF-PUM).`
  },

  /*{
    id: "mhd-instability",
    title: "MHD Instability",
    caption: "Placeholder · incompressible MHD",
    image: "assets/img/sim-placeholder-2.svg",
    alt: "Placeholder animation standing in for a magnetohydrodynamic instability",
    featured: true,
    description: `A second placeholder description. Mention the code used
                  (Nek5000, NekRS) and link the related paper if there is one.`
  },

  {
    id: "rbf-interpolation",
    title: "RBF Partition of Unity",
    caption: "Placeholder · meshless method",
    image: "assets/img/sim-placeholder-3.svg",
    alt: "Placeholder animation standing in for a radial basis function reconstruction",
    featured: true,
    description: `A third placeholder description. Good place to note the
                  convergence behaviour or the problem size this scales to.`
  }*/

];
