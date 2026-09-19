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

   See files/media/README.md for the ffmpeg commands that produce web-ready
   files. The commented-out entries at the bottom show the image form.
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

  /* -- game_fluid_solver ------------------------------------------------------
     A 2-D port of Stam's GDC 2003 stable fluid solver (NumPy + CUDA kernels via
     CuPy), a Legendre spectral solver for the same box to compare it against,
     and Tessendorf's FFT ocean. Citations are inline in each description.
     -------------------------------------------------------------------------- */

  {
    id: "stam-plume",
    title: "Smoke Plume, Stam's Stable Fluids",
    caption: "Semi-Lagrangian stable fluids · 512² · SOR · CUDA via CuPy",
    mp4: "files/media/stam_plume.mp4",
    poster: "files/media/stam_plume.jpg",
    aspect: "1 / 1",
    alt: "Grey smoke rising from a source at the bottom of a square box, rolling up into swirling filaments",
    description: `A smoke stack with a wobbling upward jet, run with a port of Stam's
                  unconditionally stable fluid solver — implicit diffusion, semi-Lagrangian
                  advection and a Gauss–Seidel pressure projection — on a 512×512 grid with
                  the hot loops as CUDA kernels. The paper's 20 Gauss–Seidel sweeps do not
                  converge the projection at this size and most of the smoke drains into
                  the walls; swapping in successive over-relaxation (ω = 1.9) at the same
                  20 sweeps retains 98% of it, at 4.7 ms per step on the GPU.
                  <br><br>
                  J. Stam, “Real-Time Fluid Dynamics for Games,” <em>Proceedings of the
                  Game Developers Conference</em>, 2003.
                  <a href="https://www.dgp.toronto.edu/people/stam/reality/Research/pdf/GDC03.pdf">PDF</a>`
  },

  {
    id: "stam-vortex-street",
    title: "Von Kármán Vortex Street",
    caption: "Stam's solver with obstacle and wrap-around extensions · 512²",
    mp4: "files/media/stam_vortex_street.mp4",
    poster: "files/media/stam_vortex_street.jpg",
    aspect: "1 / 1",
    alt: "White smoke streaming past a yellow disk and shedding an alternating trail of vortices behind it",
    description: `Smoke streaming past a fixed disk in a uniform stream and shedding the
                  alternating vortex trail of the paper's Figure 10. This needs two
                  extensions the paper describes but leaves to the reader: internal
                  obstacles, handled as a Boolean mask in the boundary routine with the
                  velocity pinned to the body's, and periodic wrap-around in the streamwise
                  direction so the flow re-enters rather than piling up at a wall.
                  <br><br>
                  J. Stam, “Real-Time Fluid Dynamics for Games,” <em>Proceedings of the
                  Game Developers Conference</em>, 2003.
                  <a href="https://www.dgp.toronto.edu/people/stam/reality/Research/pdf/GDC03.pdf">PDF</a>`
  },

  {
    id: "spectral-vs-stam-buoyant",
    title: "Buoyant Plume: Spectral vs. Stam",
    caption: "Legendre spectral Galerkin (left) next to Stam's solver (right), same forcing",
    mp4: "files/media/spectral_vs_stam_buoyant.mp4",
    poster: "files/media/spectral_vs_stam_buoyant.jpg",
    aspect: "2 / 1",
    alt: "Two side-by-side renders of hot smoke rising in an inferno colormap: a single smooth mushrooming roll on the left, a thin filamented plume on the right",
    description: `Hot smoke lifting itself under a buoyancy force proportional to density,
                  driven by the same script on two very different solvers. Left: a
                  Legendre spectral method in weak form — a nodal Lagrange basis on
                  Legendre–Gauss–Lobatto points, the pressure Poisson and viscous Helmholtz
                  solves done exactly by fast diagonalisation, SSP-RK3 in time with a modal
                  exponential filter, at N = 128 and ν = 10⁻³. Right: Stam's solver at
                  512×512 with SOR. The spectral solver conserves mass to machine precision
                  and shows the smooth laminar flow the equations actually produce at that
                  viscosity; Stam's produces the small-scale filaments that read as
                  “smoke,” most of them artefacts of residual divergence and the wall
                  treatment. On the Taylor–Green test the spectral method is three to five
                  orders of magnitude more accurate at equal cost, and one to two orders of
                  magnitude slower at equal resolution.
                  <br><br>
                  J. Stam, “Real-Time Fluid Dynamics for Games,” <em>Proceedings of the
                  Game Developers Conference</em>, 2003.
                  <a href="https://www.dgp.toronto.edu/people/stam/reality/Research/pdf/GDC03.pdf">PDF</a>
                  <br>
                  J. S. Hesthaven and T. Warburton, <em>Nodal Discontinuous Galerkin
                  Methods: Algorithms, Analysis, and Applications</em>, Springer, 2008
                  (the modal filter).
                  <a href="https://doi.org/10.1007/978-0-387-72067-8">DOI</a>`
  },

  {
    id: "spectral-advect",
    title: "LeVeque's Swirling Deformation Test",
    caption: "Pure advection on the spectral solver · N = 160 · 1.7% round-trip error",
    mp4: "files/media/spectral_advect.mp4",
    poster: "files/media/spectral_advect.jpg",
    aspect: "1 / 1",
    alt: "A white disc on black being wound into a thin spiral filament by a swirling flow, then unwound back to a disc",
    description: `The advection operator on its own. A cosine bell is carried by a
                  prescribed swirling flow that winds it into a spiral filament and then
                  reverses at half time, so a perfect scheme returns the initial blob
                  exactly. The spectral solver brings it back to within 1.7% in L² at
                  N = 160, with 1.5× the classic deformation. Two details mattered: the
                  swirl amplitude is sampled at frame midpoints, so the forward and
                  reversed halves cancel exactly, and the filament has to stay resolved or
                  the modal filter truncates it irreversibly.
                  <br><br>
                  R. J. LeVeque, “High-Resolution Conservative Algorithms for Advection in
                  Incompressible Flow,” <em>SIAM Journal on Numerical Analysis</em>,
                  33(2):627–665, 1996.
                  <a href="https://doi.org/10.1137/0733033">DOI</a>`
  },

  {
    id: "fft-ocean",
    title: "FFT Ocean",
    caption: "Tessendorf's spectral ocean with a ray-marched renderer · CUDA via CuPy",
    mp4: "files/media/fft_ocean.mp4",
    poster: "files/media/fft_ocean.jpg",
    alt: "A rendered open-ocean surface under a blue sky with thin clouds, with sun glitter and whitecaps on the wave crests",
    description: `Not a Navier–Stokes solver: the deep-water surface is a linear
                  superposition of plane waves, so it is synthesised directly. A 220 m
                  patch on a 512² grid gets Gaussian random amplitudes shaped by the
                  Phillips wind-wave spectrum; each frame the phases advance under the
                  dispersion relation ω = √(gk) and an inverse FFT gives the heights, two
                  more the “choppy” horizontal displacement that sharpens the crests, and
                  three more the displacement Jacobian whose folds mark the whitecaps. A
                  second 28 m patch is layered onto the normals for fine texture. The
                  renderer ray-marches the height field from a perspective camera on the
                  GPU and shades it with a Fresnel-weighted sky reflection, a sun glitter
                  lobe, a depth-dependent water colour, foam, distance fog and ACES tone
                  mapping.
                  <br><br>
                  J. Tessendorf, “Simulating Ocean Water,” <em>SIGGRAPH Course Notes:
                  Simulating Nature — Realistic and Interactive Techniques</em>, 2001.
                  <a href="https://people.computing.clemson.edu/~jtessen/reports/papers_files/coursenotes2004.pdf">PDF</a>`
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
