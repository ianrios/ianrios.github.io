i want a new cool way to show my job experience and personal projects and hobbies on my portfolio site.

> **SUPERSEDED 2026-07-07.** Every item below has been triaged into
> `.ai/plans/portfolio-v2-concepts.md`: sections 7-10 of that doc map each
> numbered idea here to today's session scope, an open fork still needing a
> decision, something explicitly dropped, or a new backlog spec under
> `.ai/specs/`. Kept here as the original raw brainstorm, not maintained
> further.

1. i need to add new projects and work experience (built technologies - budget versioning/ change orders, sub job/ project specific codes, unified pay app frame (add payables to draw, unit based pay apps, create data in place with rollback, autosave), ai document extraction (refinement, unifying document extraction, update to mysql), csv import flow (editable pre upload grid, ), design system) - IDEA! do i need to list out everything i did for each job at all? i think not. in fact, i get a new job every 2 to 3 years, so it might get very noisy. especially since i work as a primary contributor for startups, the number of individual projects would get immense
2. i need to create a new grouping type for job so that i can close sections and automatically open sections, perhaps on scroll? maybe on load of page? idk.
3. i want an about me page
4. i need to add new relevant links
5. i want some cool css animations (not simple transitions, but like textures and filters leveraging webgl and three.js i think, like pointer effects and hover effects, and moving background and foreground textures with the mouse and other motion components)
6. i dont like the curent v2 portfolio example. i think it could be way better. i dont care for the current portfolio v1 at all either. we have a whole design system and component library - we should be able to create anything we want, no need to constrain ourselves to the same old thing that everyone else does.
7. i want a /resume path where people can download my latest resume but also have it visualized with my work experience or something - question - do i need this? i dont think its critical.
8. i need to make sure i have the cookie accept thing i think since i use firebase on the free plan and technically harvest peoples data in order to host for free
9. i need to add a long term vision publically viewable plan for my portfolio (but actually, do i need to do this?)
10. IMPORTANT! it needs to look good on mobile!!! this is crucial.
11. i want the pages (home, design, three example, etc) to be more creative as i switch from page to page (i envision a sort of zoom out, then motion to the direction of the other page (design system is a page to the right of home, metaballs is a page to the left, contact me is its own page, below home), then zoom back in) like papers already organized on a table
12. i think i want to remove all the individual skills per job / hobby / project because i dont think its relevant in an ai first world anymore
13. i need to get gifs (or just photos) of everything i did at built (the big projects) - actually no, i think i want to remove the photos from the site entirely... i want it more minimal and cleaner
14. i need help extracting the "personal projects" from this repo, such as my agent steering repo guidance, the design library, etc
15. i think there are still some padding and margin bugs in the design library, as some buttons and other components are larger (wider or taller or both) than their parent components that contain them. seems like dynamic widths arent working nicely
16. as a project, we need to add the dynamic live design system to the app, with the live demo taking them to /design-library to view all the components
17. we need fonts added to the design system as a configurable setting. we can use free google fonts
18. on enter, pixel morph into main page, on visit any other tabs, like admin, metaballs, imagebox, etc, continue pixel morphing back to metaballs from other pages as well (pixel morphing strategy must also live in admin settings as configurable) that load it such as the view live demo button on its project
19. add a cool cursor (must also live in admin settings as configurable)
20. add a texture filter (must also live in admin settings as configurable)
21. i want to completely throw away any assumptions about what i "want" for a porfolio and work collaboratively with an agent to figure it out.
22. for every page we load (main, imagebox, resume, design system, etc) slide to it left right up or down, as if all the pages all live side by side each other on a table and we are moving the camera from one to another in real time (i havent decided if i want additional buttons like arrows pointing each direction on the home page and back on the edges of the screen or gestures or both or something different yet)
23. make a variant of the vertical navigation where it can be clicked and dragged by its top bar and moved anywhere on the screen (each page should have its own nav depending on the content and should stay fixed to its page if moved and a user comes back to that page, on mobile it should be a small menu hamburger and live on the bottom right floating but not movable)
24. i want to remove the buttons for [Design System], [Portfolio v2 Preview], & [Home (live)] once we are fully done with the overhaul.
