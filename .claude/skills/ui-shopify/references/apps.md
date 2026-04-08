# Shopify - Apps

**Pages:** 12

---

## App Design Guidelines

**URL:** https://shopify.dev/docs/apps/design

**Contents:**
- App Design Guidelines
- Why you should use these guidelines
    - Built for Shopify
    - Adaptive
    - A better merchant experience
    - Accessible
- Apps and the Shopify admin
    - Start building now
- Best practices
    - Next-App structure

Shopify's App Design Guidelines show you what great Shopify apps look like and how they're crafted. These guidelines remove the guesswork, so you can build apps that are predictable and easy to use.

We base our design guidelines on some basic principles, which we communicate through clear directives. Following these directives helps provide a better app experience for merchants.

Following these guidelines should help your app meet the Built for Shopify design requirements. Achieving Built for Shopify status gives your app preferential treatment in the Shopify App Store and signals to merchants that you meet our standards for quality and trust.

With the majority of online store traffic happening on mobile, designing for mobile devices should be at the forefront of the app building process.

Merchants expect a predictable user experience that works like the rest of the Shopify admin. Put merchant needs and context ahead of trying to make your app unique just for the sake of being different.

To provide a great experience for all Shopify merchants and their customers, apps should be built using accessibility best practices.

Apps are a crucial part of the Shopify ecosystem. They enable merchants to add functionality to their stores without leaving the familiar environment of the Shopify admin.

Using Shopify App Bridge, you can create apps directly inside the Shopify admin. A single frontend that's written with Shopify App Bridge can power point-of-sale, desktop, and mobile experiences. Apps built with Shopify App Bridge are more performant, flexible, and have more features.

By building with Shopify App Bridge and following these App Design Guidelines, you'll create a streamlined experience with the rest of the Shopify admin.

Learn about some of the patterns, components, and features that are common in Shopify apps by building an example app.

Learn about some of the patterns, components, and features that are common in Shopify apps by building an example app.

We believe that the best apps provide merchants with a user experience that matches the appearance and behaviors of the Shopify host surface. This consistency builds merchant trust, because merchant workflows often cross between apps and native pages of the Shopify admin.

For apps embedded into the Shopify admin, we recommend using the components and best practices of Polaris, which is the Shopify admin design system.

We're constantly innovating and evolving the Shopify admin. By using Polaris, your app can evolve with us.

Your app's UI should demonstrate a good faith effort to leverage common UX best practices and meet a high bar for design quality.

---

## Layout

**URL:** https://shopify.dev/docs/apps/design/layout

**Contents:**
- Layout
- Responsive grid layout
- Layout options
  - Single-column layout
  - Two-column layout
  - Settings layout
- Spacing
    - The 4px spacing grid
- Information density
- Containers

Layout design is the process of arranging visual elements such as text, images, and shapes on a page.

Apps have a variety of available layouts. These layouts adapt the app body content to every screen size and device type. Selecting the proper layout for the task at hand will benefit your app's merchant experience.

Responsive grid layout The Page web component provides built-in responsiveness for the aside slot. The Grid web component allows more bespoke responsive handling. Take these into consideration when you build your app.

Design your app to be responsive and adapt to different screen sizes and devices. This ensures a consistent user experience across various platforms.

Layout options The Page web component offers various layouts to match the complexity of your app.

The single-column layout enables merchants to scan content from top-to-bottom and focus on a single, obvious task.

Most often, an app's homepage uses the single-column layout in a default-width page. However, if your app feels more like a dashboard, then you can also use the two-column equal width or three-column layout.

For resource index pages, use a full-width page. This is helpful when merchants are dealing with lists of data that have many columns.

Two-column layouts allow merchants to view more content at once. This is helpful for visual editors or content-dense pages.

For visual editors, use a two-column layout. This allows merchants to preview the outcome of their edits in real-time.

The settings layout lets merchants quickly scan and find groups of settings that are related to each other.

For settings pages, use the settings pattern to provide merchants with clear context about your app's configuration options.

Spacing helps your app maintain a pleasant experience by keeping interface components well-positioned with consistent visual rhythm. To simplify spacing, use the Stack web component.

The Shopify admin is built on a 4px spacing grid. Following this grid helps your app match the admin's spacing and feel native. You can use the Page and Stack web components to achieve this.

The density of elements in a layout can greatly impact your app's readability and usability.

Make your app efficient and easy to use by providing the right density at the right moment, for the right task.

Use looser spacing for low-density layouts. Use tighter spacing for high-density layouts.

Avoid changing information density within a single page, otherwise your app can feel disjointed.

Most of an app's content exists in containers. Containers compartmentalize content and create a natural hierarchy between parts of an interface.

Avoid placing paragraphs of text directly on the background. This reduces legibility and makes scanning the page difficult for merchants.

Sections structure your app's content so that merchants can scan information easily. Sections act as containers and can be static or interactive.

The Section web component provides an easy way to segment content, while still respecting Shopify's App Design Guidelines.

The majority of your app's content should live in a container, such as a card. This creates visual structure and rhythm that helps merchants find information quickly.

Cards that offer interactivity, such as calls to action (CTAs) and buttons, should have at most one primary styled action.

Using tables Tables are helpful for summarizing many object instances. Use the Table web component for relatively simple summaries, and the Index table pattern when you have a lot of data to show.

Refer also to the Polaris pattern for Resource index layout, when you are summarizing resource objects.

Actions in tables should use secondary action styling, such as a text button, minor icon, or dropdown menu. Avoid using primary style buttons in tables.

---

## Subscription apps

**URL:** https://shopify.dev/docs/apps/design/user-experience/subscription-apps

**Contents:**
- Subscription apps
  - Guidance
    - Previous-Forms
    - Next-Build an example app
  - Updates
  - Business growth
  - Legal
  - Shopify

Subscription apps offer customers a subscription purchase option. To ensure a positive experience for customers, subscription apps should follow these design guidelines.

This guide explains the key principles of subscription needs and component-level guidelines for implementing subscription user interfaces. Refer to the subscriptions section of Shopify.dev for more details.

The price of a subscription should be clearly visible when a customer has selected a selling plan from a product form.

Subscription related UI should match the color palette, font, font-size and font weight of the store's current theme by default.

---

## Visual design

**URL:** https://shopify.dev/docs/apps/design/visual-design

**Contents:**
- Visual design
- Fitting into the admin
- Color
- App icon
  - Specifications
  - Preparing your app icon
- Typography
  - Type hierarchy
  - Font sizes
- Icons

Visual design focuses on app aesthetics through the strategic use of images, colors, fonts, and other elements.

Colors, fonts, icons, illustrations, and many other visual elements have a big influence on your app's usability. Great apps use strong visual design to heighten the merchant experience.

Fitting into the admin Because merchant workflows cross between apps and the Shopify admin, merchants can have an easier time accomplishing their tasks when apps use the same visual design cues as the admin. The easiest way to create a harmonious experience with the Shopify admin is by following our design system, Polaris.

Admin UI extensions blend in seamlessly with the Shopify admin UI. For optimal integration, we recommend that embedded app workflows follow Polaris. Otherwise, the merchant experience across embedded apps and admin UI extensions might break or feel jarring.

Admin UI extensions blend in seamlessly with the Shopify admin UI. For optimal integration, we recommend that embedded app workflows follow Polaris. Otherwise, the merchant experience across embedded apps and admin UI extensions might break or feel jarring.

Refer to the web components for styles that we use across the Shopify admin, such as colors, typography, spacing, shadows, borders, and more.

Your app exists within the Shopify admin, so you should consider colors that adhere to the Admin. Your colors should also respect minimum contrast ratios when used with text or interactive elements.

While colors are useful in design, avoid relying on color only to provide context. For alerts like error states, success states, or system warnings, include messaging or iconography that explains what's happening.

Present the majority of app text in a legible and neutral color, such as black or dark gray.

Green should be used to indicate that a status is positive or that an action has been completed successfully. Avoid using green to entice merchants or to draw unnecessary attention.

Yellow should be used to indicate that a status is on pause or incomplete, or to highlight information that requires merchant attention but isn't urgent. Avoid using yellow for announcements.

Orange should be used to indicate that a status is in-progress, pending, or to tell merchants that something needs their attention. Orange is the strongest, non-blocking color role in the Shopify admin. Avoid using orange for "under construction" or "coming soon" messaging.

Red should only be used to convey messaging that implies an action is impossible, blocked, or has resulted in an error. Avoid using red to entice merchants or to draw unnecessary attention.

Background-to-text contrast ratio should be at least 4.5:1 to be WCAG AA compliant. Test your ratios using a tool such as WebAIM Contrast Checker.

Your app icon acts as the main visual identifier for merchants.

The app icon displays in many touch points, like in the Shopify App Store, on the Apps page in the Shopify admin. Shopify renders your app icon as an SVG into the admin left hand navigation.

To change your app icon, go to the app's Settings page in the Dev Dashboard.

To change your app icon, go to the app's Settings page in the Dev Dashboard.

App icons will be used on white and light gray backgrounds, so avoid using similar colors that might make your icon illegible.

Adhere to the following app icon specifications:

Design your app icon at 1200px x 1200px. This ensures that your icon meets the size requirements.

We recommend using the app icon templates to easily adhere to app icon guidelines.

We recommend using the app icon templates to easily adhere to app icon guidelines.

Design your icon to fill 10/16ths (750px for a 1200px icon) of a vertical or horizontal space.

Design your icon to at most fill 12/16ths (900px for a 1200px icon) of a vertical or horizontal space.

Leave a 1/16th (75px for a 1200px icon) margin around your icon that's free of any visual elements.

Avoid using excessive amounts of text in your icon. This makes it hard to identify and read at smaller sizes.

Don't mislead merchants by using an app icon that you don't own. This includes any part of the Shopify logo.

Typography is the arrangement of letters in a way that makes reading text easy and comfortable for merchants.

The Polaris Text component provides a great way to streamline typography.

Proper use of typography can improve the app experience. By creating a healthy visual hierarchy between headlines and copy, you'll improve legibility and consistency with the Shopify admin.

Typography should create a clear hierarchy between headings and text that's easily legible by merchants. Whenever possible, the title of the current page should be the largest heading size.

Make headings visually distinct from the rest of the text, by being bolder, larger in size, or both. Avoid using underlines that might be mistaken for links.

Avoid using only color to distinguish a heading to convey hierarchy, as some merchants may not be able to perceive color.

Our font size specifications apply to the minimum sizes required for legibility in the Shopify admin.

Use 13px as the minimum size for headings, body text, and text in interactive elements.

12px is the minimum size for smaller copy, like captions and subheadings.

Icons act as visual aids to help merchants complete tasks. They're often paired with text to make your app easier to use and to disambiguate certain interactions. You can save time by using the Polaris Icon component, or create your own by following the Polaris icon guidelines.

Icons can help merchants better understand the outcome of an action, or help them understand more technical terms that they might not be familiar with.

Avoid using icons inconsistently in lists and other repeating elements. This makes your app look broken.

Illustrations give your app personality and help merchants understand complex concepts through meaningful visual metaphors.

Following the Polaris illustrations guidelines is a great way to make your app's illustrations fit nicely with the Shopify admin.

Keeping a consistent illustration style in your app can strengthen your brand presence and make your app easily recognizable.

Avoid using low resolution photos or images, as they can convey a lack of care and poor quality experience.

---

## Marketing

**URL:** https://shopify.dev/docs/apps/design/user-experience/marketing

**Contents:**
- Marketing
- Branding
- Promotion
    - Previous-Onboarding
    - Next-Forms
  - Updates
  - Business growth
  - Legal
  - Shopify

The Shopify admin is first and foremost a place for merchants to get work done. These directives explain how to incorporate marketing messages in your app in an unobtrusive way.

Branding can set your app apart from others, but over-branding sets it apart from Shopify. We recommend expressing your brand with a light touch. Imagery and illustration styles are great and non-disruptive ways to do this.

Express your app's brand through illustration and imagery. Try to keep your app's layouts and common components, like Cards, consistent with the Shopify admin.

Promotional messages include requests to rate the app, plan or subscription upgrades, or calls to download additional apps.

Remember that merchants are looking to the current app they installed to accomplish a task or certain workflow. We have specific directives to limit the interference of marketing messages.

Refer to the Polaris App card pattern for more information.

Place promotional messages into a dismissible container, such as a card or gallery, at the bottom of your app homepage. Or, create a separate page dedicated to promotional messages.

Promotional information on the app home page should be dismissible. If dismissed, the information shouldn't display for the same user again.

Features that are only available to paid or premium plans should be in a visually-disabled state. Use caption-style text in a subdued color to communicate that the feature is available only by upgrading.

Don't mislead or pressure merchants. Your app should not include fake reviews, false special offers, or use elements like countdown timers for limited-time opportunities. Deceptive or manipulative promotion practices erode merchant trust in your app and in Shopify.

Don't oversell or overpromise. This can break trust with customers.

Avoid mixing the primary call to action (CTA) with unrelated actions such as marketing messages or requests for support. This obscures the primary action.

Avoid presenting the same marketing messages on all app pages.

---

## Forms

**URL:** https://shopify.dev/docs/apps/design/user-experience/forms

**Contents:**
- Forms
  - Guidance
    - Previous-Marketing
    - Next-Subscription apps
  - Updates
  - Business growth
  - Legal
  - Shopify

Most Create and Edit actions require the use of forms for data input. Good form design is important because these are likely the most frequent touchpoints that merchants have with your app.

Many apps have complex forms, with many input fields. This can be overwhelming for merchants. Ensure that your forms use proper spacing by using the Polaris Stack component.

Follow this guidance to create organized forms that will be easy for merchants to understand.

Use progressive disclosure when form inputs or information changes depending on input values. This prevents merchants from becoming overwhelmed by very long forms.

The Shopify admin uses individual pages for object definitions. For example, a single page is used for a single product definition, or a single page is used for a variant definition. Following this pattern can help focus merchant workflows and make your app look more like the Shopify admin.

For more than five inputs, use sections with titles in one card or use multiple cards with headers.

Avoid placing large forms inside max height, max width modals. Instead, create a new page in your embedded app to give merchants room to work with the form inputs.

Forms should be saved using the Polaris Data Save Bar API. This also applies to forms within app windows. Continuous data validation or auto-save for forms is incongruous with the standard Shopify admin save UX.

Refer to the Alerts page for guidance on how to show form errors to merchants.

---

## App home page

**URL:** https://shopify.dev/docs/apps/design/user-experience/app-home-page

**Contents:**
- App home page
- Design
- Purpose
- Support
    - Previous-Alerts
    - Next-Onboarding
  - Updates
  - Business growth
  - Legal
  - Shopify

Your app home page is the first page that merchants see, and it should provide daily value to them.

Design the app home page in a way that quickly answers any questions that merchants might have and conveys the actions that are available to them. See the Homepage pattern for more information.

App homepages take many forms. A good home page should do the following:

Your app home page should provide merchants with quick statistics, status updates, or information that's immediately actionable.

Providing stellar customer support is a great way to set your app and service apart from the rest. Place your support CTAs in a place that's consistent and discoverable. Be as responsive to merchant questions as you can.

Place your support CTAs consistently, but also out of the way of merchants. You can use an item in the Polaris App nav, place a link in your page footers, or use a floating action button.

---

## Alerts

**URL:** https://shopify.dev/docs/apps/design/user-experience/alerts

**Contents:**
- Alerts
  - Task alerts
  - System alerts
- Alert patterns
- Information
  - Informational banner
- Success
  - Toast
  - Success banners
- Warning

Alerts notify merchants of important system information, and provide feedback on merchant actions.

Task alerts are initiated in response to merchant actions during a specific task. Task alerts give merchants direct and immediate feedback.

The following are examples of task alerts:

System alerts are initiated by the application or system, independent of merchant actions. System alerts provide updates on background system status or out-of-context events that have finished.

The following are examples of system alerts:

The following are common patterns available for merchant alerts:

When you use alerts to communicate important information to merchants, you can choose from a few standard patterns.

Use an informational banner with the blue header when you want to convey general information or actions that aren't critical.

Informational banners should have a blue header and contain only lower priority information that's always dismissible.

Banners should be dismissible unless they contain critical information that merchants need to resolve to move forward. Dismissed banners shouldn't display again within the same user session.

When you're communicating success, it's important to provide feedback. That means using patterns that inform merchants when a task has been completed successfully.

Toasts inform merchants of a process that the app has performed or will perform. Toasts display temporarily, at the bottom of the interface. Toasts don't require any merchant input to disappear, and they shouldn't interrupt the merchant experience.

Display toasts in the bottom center of your app screen.

Use toasts for only short messages that confirm an action.

Make toast messages three words or fewer.

Toasts are only for non-critical messages that are relevant at the moment.

Avoid toasts for error messages, except for persistent errors such as connection errors.

Only use success banners when feedback is delayed, persistent, or has a call-to-action (CTA). Otherwise, use toasts.

Make success banners green and include next steps, if applicable.

Avoid using banners to show success messages for actions that merchants have completed. For user-initiated feedback, use success toasts instead.

Avoid using success banners if there isn't a CTA.

When you're communicating warnings to merchants, you have different options based on what's causing the warning.

Use warning banners to display information that needs attention or that merchants need to take action on.

Make warning banners yellow. Seeing these banners can be stressful for merchants, so use them intentionally.

Inline warning in a list Indicate specific items in a list that you want to make merchants aware of. You can use the Badge web component for this.

Use inline warnings to draw attention to exceptions in a list, and encourage action when possible.

Avoid only using color to convey a warning. Pair warning messages with a warning icon. This increases accessibility by providing additional identifiers.

When you're communicating problems and errors, use recognizable patterns that inform merchants of the alert's significance. Put error messages as close to the problem as possible.

Error messages are necessary when something isn't working as expected, or when merchants should be alerted to critical disruptions.

When errors happen, they can be frustrating or even scary. Guide merchants to a solution clearly and quickly.

Make error banners red. Always tell merchants what happened and offer a path forward.

Avoid using scary language, technical terms, and jargon.

Avoid using humor, idioms, or other words and phrases that might not translate correctly.

Use critical banners when you're communicating problems that need to be resolved immediately for merchants to complete a task.

Make critical banners red and use them sparingly.

Provide troubleshooting steps and a clear way to get support.

When you're validating form fields like text fields, place the error message directly below the affected field.

Use red for error message text, because it's a common convention outside of Shopify.

Place error messages directly below the affected field.

Avoid showing an error while merchants are typing, because it can cause confusion. Wait until the keyboard focus moves away from the field, and then display the error.

Inline errors in lists Indicate specific items in a list that you want to make merchants aware of. You can use the Badge web component for this.

Highlight an exceptional state that encourages merchants to click on a list item. Lead with what went wrong.

Avoid only using color to convey an error. Instead, pair the error message with an error icon. This increases accessibility by providing additional identifiers.

If an error applies to a specific card, section, or modal, then place it near the top of the affected element.

Avoid nesting error messages too deeply within your app's hierarchy. If the error applies more broadly, then place it at the top of the affected element.

Avoid using modals to handle error messages. Only place an error message inside a modal if the modal itself is experiencing an error.

---

## Content

**URL:** https://shopify.dev/docs/apps/design/content

**Contents:**
- Content
- Voice and tone
- Product content
  - Use plain language
  - Be consistent
  - Encourage action
  - Guide, don't prescribe
- Grammar and mechanics
    - Previous-Visual design
    - Next-Navigation

Writing and designing content in a thoughtful way makes your app usable, accessible, and readable.

Your written content's voice and tone help you talk to merchants in a consistent, recognizable way.

Voice refers to aspects of writing that are consistent across all contexts and audiences. Tone can change based on the audience and their current context.

Learn how to apply Shopify's voice and choose the right tone, no matter what app you're building, by referring to the Polaris guidelines on voice and tone.

The following are some principles behind writing product content for a quality merchant experience.

Avoid duplicating content, such as adding a page title under the page Title bar, adding horizontal navigation when using the App nav, or presenting the same content in different ways on the same page.

Shopify merchants are located all over the world, have varying levels of literacy, and might not speak English as their first language. Content can easily be mistranslated or misinterpreted.

Structure your content in a clear, efficient way.

Use headings, bullets, and short sentences to make your content more scannable.

Use clear terms that are easily understood. As a benchmark, aim for a United States grade 7 reading level. You can check reading levels with tools like Hemingway App.

Avoid using jargon or overly technical language that might be difficult for merchants to understand.

Avoid using large blocks of text, because they're hard for merchants to scan and gather the most important information quickly.

Avoid using idioms and phrases with indirect or ironic meanings, as they can be misinterpreted or mistranslated.

To help merchants understand key concepts and actions, use terms in a consistent way.

One way to ensure consistency is to identify and eliminate synonyms for key concepts and actions.

Use a single noun, verb, or phrase to describe a specific thing, action, or concept.

Avoid using multiple synonyms to describe a specific thing, action, or concept.

Merchants use Shopify to get things done for their businesses. Write content that helps merchants understand and take the most important actions.

For calls to action (CTAs), start with a strong verb that describes the action. Use active voice to clarify the subject and the action.

Prioritize the most important information and tasks. Break complicated tasks into steps that focus on individual actions.

Write in a way that puts your merchant at the center and in control. Provide merchants with tools and knowledge for making the best decision.

Give merchants enough information to make the right decision on their own.

For spelling, punctuation, and other grammatical considerations, refer to the Polaris guidelines on grammar and mechanics.

Apps should use proper grammar throughout to ensure the best experience for merchants.

In the first reference to your app or company, use its proper name. If you require additional references in the same content section, then you can use "we". This helps maintain clarity while keeping the content concise.

---

## Onboarding

**URL:** https://shopify.dev/docs/apps/design/user-experience/onboarding

**Contents:**
- Onboarding
  - Purpose
  - Guidance
    - Previous-App home page
    - Next-Marketing
  - Updates
  - Business growth
  - Legal
  - Shopify

Onboarding is the process that merchants follow to set up your app. The onboarding process is crucial to merchant success.

Onboarding should welcome merchants and make them eager to use your app or feature. Onboarding makes merchants comfortable and sets their expectations as soon as they start using your app.

Merchants should feel like they know what to do in your app after they've completed the onboarding experience. This leads to higher usage retention. Refer to the Polaris Setup guide pattern.

Onboarding is about sharing your app's benefits and quickly getting merchants ready to use your app.

Onboarding should be brief and direct. Provide clear instructions and guide merchants to completion.

Onboarding experiences efficiently guide merchants through your app's features so that merchants don't have to discover them on on their own.

A great onboarding experience presents the basics of your app to merchants as quickly as possible.

Onboarding experiences can also come in the form of a selection of actions that are quick and easy for merchants to understand.

In some cases, complex onboarding can take longer than expected. Give merchants the option to complete the onboarding at a later time to avoid stopping their workflow.

While there isn't a ready-made Polaris pattern for setup guides, you can compose your own with Polaris components and look for examples across the Shopify admin. A good setup acts as a quick start, with discrete steps that are automatically marked as complete. Including a progress indicator is another good practice that provides encouraging feedback to merchants.

Request information from merchants only if it's necessary.

If your onboarding isn't essential, then make it dismissible using a Polaris Cancel icon.

Avoid more than five steps in your onboarding process, as additional steps can lead to merchant drop off.

---

## App structure

**URL:** https://shopify.dev/docs/apps/design/app-structure

**Contents:**
- App structure
- Anatomy
- App body
- App window
  - When to use app window
  - Behavior
- Admin UI extensions
  - App attribution
  - When to use admin blocks
  - When to use admin actions

Apps are structured to work seamlessly with the Shopify admin and to provide an intuitive experience for merchants.

Apps consist of a few navigation elements and the app body, which is the center of your app's experience.

App navigation is strictly configured, and it's an important part of providing a great merchant experience. For more details, refer to the navigation guidelines.

The app body is where your app's main experience lives.

Be sure to follow the layout guidelines when you choose a layout for the app body.

App window is a focused environment for specific immersive tasks.

The app window utilizes the following areas of the app interface:

Use app window when merchants need to complete a focused task, where leveraging the full viewport improves the user experience.

The following are some example use cases:

Behavior App window launches only after merchants interact with a button that indicates the entire canvas will be used.

Primary navigation for the app should be shown in the top bar of the app window and the primary actions should not be duplicated.

If there are unsaved changes, prompt merchants to save before exiting full-screen mode.

Avoid unnecessarily interrupting a merchant's workflow when exiting app window.

Your app should not launch full-screen or the app window from the app nav. Instead, they should launch from the app body. This is an app store requirement.

Avoid using the FullscreenBar within an app window, as it results in redundant mechanisms to dismiss the app window.

Use admin UI extensions to integrate more deeply with the Shopify admin and create seamless merchant workflows.

Choose from the following extensions:

Additional admin extensions are available for more specific use cases.

The extension can't be used to display promotions or advertisements. This includes promoting your app, related apps, or requesting app reviews. This is an app store requirement.

Shopify will badge all admin UI extensions with the app icon, name, and a link to your app URL.

The app attribution component displays your app's logo and extension name as it displays in the Shopify App Store.

Use admin block extensions to offer your app's functionality or data in the context of a resource detail page. Merchants have the option to add your app block to a page, and arrange it in the page layout.

App blocks can be embedded into Product, Order, or Customer detail pages using these extension targets.

Learn more about admin blocks.

Contents should be less than 600px in height, to avoid overly tall app blocks. If necessary, implement pagination to ensure that this requirement is met.

Input fields should be visible at all times. If necessary, app blocks should trigger app actions to ensure that this requirement is met.

Your block should have an empty state that informs merchants about what your app block does. For example, it should tell merchants what data will display in the block.

Inputs in your block can work with the contextual save bar by using the Form component, which provides merchants with a familiar save and validation experience.

Use admin action extensions to offer merchants quick access to common actions that they might do with your app. Because apps can add an unlimited number of admin actions, use discrete actions for discrete purposes.

App actions can be targeted to these extension targets.

Learn more about admin actions.

Apps can have multiple admin action extensions, which display in the More actions menus.

Avoid action content that exceeds 1200px and avoid using more than two steps of pagination. Otherwise, your app can be difficult to navigate.

If your content doesn't fit well within the format of the block or action, then use an admin link or bulk action instead. If an interaction is complex, such as one that requires more screen space, then routing merchants into your app is a better experience.

Examples include a multi-step process, a very long form with multiple dynamic sections, or a complex editor with several columns.

Admin links show up in the More actions menus.

Bulk actions show up in the More actions menu of bulk actions controls.

Use app actions and blocks together to provide a more focused merchant experience.

An admin block can trigger an admin action. For more information, refer to the extension custom protocol.

Avoid duplicating the content of your admin blocks and admin actions. Differentiating the functionality and value of your blocks and actions helps merchants understand which extensions to use and when.

---

## Navigation

**URL:** https://shopify.dev/docs/apps/design/navigation

**Contents:**
- Navigation
  - Why is navigation important?
- Information architecture
  - Why is IA important?
  - App home
- App nav
  - App name
  - Navigation icon
- App header
  - Overflow menu

Navigation enables merchants to move between sections of your app.

Navigation is how merchants move from task to task. A good navigation structure enables merchants to complete tasks easily and without friction. Build your app's navigation around what merchants need to do.

Navigation elements display in the following areas:

Information architecture (IA) is the practice of organizing sections so that they make sense as a whole.

IA shows merchants where they currently are, and how to navigate the rest of the app. It should be obvious what previously happened and what will happen next.

Rely on the relationship between the app nav and app body components to guide merchants where they need to go.

Use the fewest possible categories to define what your app does.

Merchants should be able to return to the previous page without using the browser button. To achieve this, your app can provide breadcrumbs or a Back button on the page.

Don't send merchants outside of the Shopify admin for key actions or during primary workflows.

The app URL specified in the Dev Dashboard should point to your app homepage. This page is the default view when your app's name is selected in the Shopify admin.

If you're building an app that's made entirely of extensions, then a default app home URL and homepage is provided.

Use the app name to point at your app's homepage. This is controlled in the Dev Dashboard, under App > Versions > Create a version >App URL.

Avoid duplicating the app homepage's URL in your navigation.

The app nav gives merchants a way to move between pages of your app.

The app nav is located in the sidebar in the Shopify admin and in the header in Shopify mobile.

Use tabs sparingly for secondary navigation purposes when the s-app-nav isn't sufficient. Clicking a tab should only change the content below it, not above. Tabs should never wrap onto multiple lines. Navigating between tabs shouldn't cause the tabs to change position or move.

Make navigation items short and scannable. Use nouns instead of verbs to keep the navigation menu concise.

When you use more than seven items in the App nav web component, item seven and above are truncated into a View more button.

Avoid replicating the app nav content in the app body, as it results in unnecessary repetition.

Avoid placing the main navigation in the page header. This can mislead merchants. The page header is reserved for in-page actions.

The app name represents a way for merchants to identify your app across multiple touchpoints in the Shopify admin.

The app name can be shorter than the Shopify App Store listing, so that it fits into the app nav.

To change your app name, in the Dev Dashboard navigate to Versions and click Create a version.

To change your app name, in the Dev Dashboard navigate to Versions and click Create a version.

Keep app names short, with no more than 20 characters. Names beyond 20 characters will be truncated.

Avoid putting a description in the app name. Put the description in the Shopify App Store listing instead.

Submit a navigation icon that displays in the app nav. The navigation icon is gray when it's inactive and green when it's active.

To learn more about designing your navigation icon, refer to the visual design guidelines.

To change your navigation icon, navigate to App setup > Embedded app in the Partner Dashboard.

To change your navigation icon, navigate to App setup > Embedded app in the Partner Dashboard.

If you're using an SVG icon in the Shopify admin navigation, then it should look similar to your app's App Store icon. It's not mandatory to have an SVG icon.

Navigation app icons are cropped with a 4px border radius. You don't need to submit your icon with rounded corners.

The app header contains main structural pieces for your app. It's the header that merchants will interact with throughout the entire app experience.

Refer to the Polaris Page web component documentation for more information.

The app header contains the following elements:

The overflow menu is reserved for additional support information about your app.

The overflow menu includes the following content:

At this time, the overflow menu isn't customizable.

On mobile, the option to pin the app is collapsed into the overflow menu.

On mobile, the option to pin the app is collapsed into the overflow menu.

The page title should be short and describe the general purpose of the page.

Try to limit each page to a single purpose. Merchants prefer focusing their attention on specific tasks, and splitting their attention might damage the user experience.

The primary and secondary buttons in the Polaris Page web component initiate a page-specific action.

Primary and secondary button labels should have the following attributes:

Offer merchants clear and predictable action labels.

---
