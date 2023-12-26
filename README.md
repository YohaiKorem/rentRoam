# rentRoam

## live app:
https://rentroam2.onrender.com/#/stay

## Introduction
**rentRoam** is an Airbnb clone, crafted with Angular and RxJS to deliver a high-performance and responsive user interface. This project offers a streamlined experience for property rentals, incorporating advanced features and custom directives for an intuitive user experience.

## Key Features

- **Angular and RxJS:** Utilizes Angular for a dynamic and responsive UI, enhanced with RxJS for efficient state management.
- **Custom Directives:** Includes unique Angular directives such as `GooglePlacesAutocompleteDirective`, `ImgErrorDirective`, and `SwipeDirectiveDirective` for enriched UI components.
- **Unsub Class:** Implements the `Unsub` class, an abstract class leveraging RxJS to handle efficient unsubscription and prevent memory leaks.

## Custom Directives

- **GooglePlacesAutocompleteDirective:** Integrates Google Places Autocomplete for location inputs.
- **ImgErrorDirective:** Provides a fallback image source in case of loading errors.
- **SwipeDirectiveDirective:** Adds swipe functionalities for touch-enabled devices.
- **PreventDefaultDirective:** Prevents default action on click events.

## Installation

Ensure you have the latest version of Node.js and Angular CLI installed.

Clone the repository:

```bash
git clone https://github.com/YohaiKorem/rentRoam.git
```

Navigate to the project directory:

```bash
cd rentRoam
```

Install dependencies:

```bash
npm install
```

## Usage

Start the project locally with Hot Module Replacement (HMR) for a better development experience:

```bash
ng s
```

## Contributing

We welcome contributions! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a new Pull Request.

---

For more details and updates, visit the [rentRoam GitHub repository](https://github.com/YohaiKorem/rentRoam).
