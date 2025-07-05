# 🛒 La Diversité - Imported Beverages E-commerce

This project is the result of the Final Course Project (TCC) for the Technology in Systems Analysis and Development program at the Federal Institute of Education, Science and Technology of Rio Grande do Sul – Sertão Campus.

## 📌 Overview

The system is an e-commerce platform developed for the fictitious company **La Diversité**, specialized in selling imported beverages. Its main goal is to automate the sales process, modernize customer service, and expand the brand's digital reach.

The platform allows customers to:
- View featured products,
- Apply filters by name, category, and price,
- See detailed product information,
- Add items to the shopping cart,
- Complete purchases via credit card or PIX,
- View their order history.

Additionally, it includes an admin panel for managing the product catalog.

## 🎯 Goals

### General Objective
Develop an e-commerce platform for online sales of imported beverages, promoting practicality, scalability, and autonomy for both customers and administrators.

### Specific Objectives
- Build a responsive and accessible interface;
- Implement user and admin registration with Clerk authentication;
- Allow product management by administrators;
- Provide checkout with multiple payment methods;
- Ensure data security and good usability.

## 🛠️ Technologies Used

- **Frontend:** React + TypeScript  
- **Styling:** TailwindCSS  
- **Authentication:** Clerk  
- **Global State Management:** Redux  
- **Mock Database:** JSON Server  
- **Address API:** BrasilCEP  
- **Version Control:** Git + GitHub  

## 🖥️ Key Features

### Customer
- Sign up and log in (email/password or Google)
- Product browsing and filtering
- Shopping cart
- Checkout with address input and payment selection
- Order history
- Product reviews

### Administrator
- Restricted access via Clerk role
- Product creation, editing, and deletion
- Order overview

## 📦 Installation and Execution

Follow the steps below to run the project locally:

1. Clone this repo

```bash
git clone https://github.com/vanleybasso/ladiversite.git
```

2. Install the packages and dependencies using npm

```bash
npm install
```

3. Install JSON Server globally

```
npm install -g json-server
```

4. Run the project, start the front-end

```bash
npm run dev
```

5. Start the backend

```bash
npm run server
```

6. Visit the app

```
localhost:5173
```

## 👤 Author

**Vanley Basso**  
Undergraduate Student – Technology in Systems Analysis and Development  
Federal Institute of Education, Science and Technology of Rio Grande do Sul – Campus Sertão  
📧 [vanley_basso@hotmail.com](mailto:vanley_basso@hotmail.com)

## 🎓 Advisor

**Prof. Carlos Mario Dal Col Zeve**  
Federal Institute of Education, Science and Technology of Rio Grande do Sul – Campus Sertão  
📧 [carlos.zeve@sertao.ifrs.edu.br](mailto:carlos.zeve@sertao.ifrs.edu.br)

## 🙏 Acknowledgments

I would like to express my sincere gratitude to everyone who contributed directly or indirectly to the development of this project. Special thanks to my advisor, Professor Carlos Mario Dal Col Zeve, for the guidance, support, and encouragement throughout the process. I also extend my appreciation to the Federal Institute of Education, Science and Technology of Rio Grande do Sul – Campus Sertão, for providing the knowledge and structure necessary for my academic and professional growth. This project marks the conclusion of an important phase in my education and reflects the dedication and learning acquired during the course.

## 📬 Contact

If you have any questions, suggestions, or would like to get in touch, feel free to reach out:

- 📧 Email: [vanley_basso@hotmail.com](mailto:vanley_basso@hotmail.com)  
- 💼 LinkedIn: [linkedin.com/in/vanleybasso](https://www.linkedin.com/in/vanleybasso)  
- 🐙 GitHub: [github.com/vanleybasso](https://github.com/vanleybasso)



