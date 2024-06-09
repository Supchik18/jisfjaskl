// Смарт-контракт
const contract = {
    users: {},
    properties: {},
    announcements: {},
    balances: {},
    propertyCount: 0,
    announcementCount: 0,

    register: async (publicKey, password) => {
       
        if (!checkPasswordComplexity(password)) {
            throw new Error("Password is not complex enough");
        }

        const user = {
            publicKey,
            password
        };
        contract.users[publicKey] = user;

    
        console.log(`User registered successfully: ${publicKey}`);
    },

    createProperty: async (description, price) => {

        contract.propertyCount++;
        const propertyId = contract.propertyCount;
        const property = {
            id: propertyId,
            description,
            price,
            status: "available"
        };
        contract.properties[propertyId] = property;

     
        console.log(`Property created successfully: ${propertyId}`);
    },

    createAnnouncement: async (propertyId, price) => {
        
        contract.announcementCount++;
        const announcementId = contract.announcementCount;
        const announcement = {
            id: announcementId,
            propertyId,
            price,
            status: "active"
        };
        contract.announcements[announcementId] = announcement;

      
        console.log(`Announcement created successfully: ${announcementId}`);
    },

    purchaseProperty: async (announcementId) => {
       
        const announcement = contract.announcements[announcementId];
        if (!announcement) {
            throw new Error("Announcement not found");
        }

        if (announcement.status !== "active") {
            throw new Error("Announcement is not active");
        }

       
        const userBalance = contract.balances[announcement.propertyId];
        if (userBalance < announcement.price) {
            throw new Error("Insufficient balance");
        }


        announcement.status = "sold";

        contract.balances[announcement.propertyId] -= announcement.price;

     
        console.log(`Property purchased successfully: ${announcementId}`);
    },

    withdrawFunds: async (amount) => {
        
        const userBalance = contract.balances[announcement.propertyId];
        if (userBalance < amount) {
            throw new Error("Insufficient balance");
        }

        contract.balances[announcement.propertyId] -= amount;

      
        console.log(`Funds withdrawn successfully: ${amount}`);
    },

    getProperties: async () => {
        return Object.values(contract.properties);
    },

    getAnnouncements: async () => {
        return Object.values(contract.announcements);
    },

    getUserBalance: async (publicKey) => {
        return contract.balances[publicKey] || 0;
    }
};

// Функция для проверки сложности пароля
function checkPasswordComplexity(password) {
    
    if (password.length < 12) {
        return false;
    }

    
    let hasUppercase = false;
    for (let i = 0; i < password.length; i++) {
        if (password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90) {
            hasUppercase = true;
            break;
        }
    }
    if (!hasUppercase) {
        return false;
    }

    let hasLowercase = false;
    for (let i = 0; i < password.length; i++) {
        if (password.charCodeAt(i) >= 97 && password.charCodeAt(i) <= 122) {
            hasLowercase = true;
            break;
        }
    }
    if (!hasLowercase) {
        return false;
    }

    
    let hasDigit = false;
    for (let i = 0; i < password.length; i++) {
        if (password.charCodeAt(i) >= 48 && password.charCodeAt(i) <= 57) {
            hasDigit = true;
            break;
        }
    }
    if (!hasDigit) {
        return false;
    }


    let hasSpecialCharacter = false;
    for (let i = 0; i < password.length; i++) {
        if ((password.charCodeAt(i) >= 33 && password.charCodeAt(i) <= 47) ||
            (password.charCodeAt(i) >= 58 && password.charCodeAt(i) <= 64) ||
            (password.charCodeAt(i) >= 91 && password.charCodeAt(i) <= 96) ||
            (password.charCodeAt(i) >= 123 && password.charCodeAt(i) <= 126)) {
            hasSpecialCharacter = true;
            break;
        }
    }
    if (!hasSpecialCharacter) {
        return false;
    }

    return true;
}

// Обработчики событий
document.getElementById("register-btn").addEventListener("click", async () => {
    const publicKey = document.getElementById("public-key").value;
    const password = document.getElementById("password").value;
    try {
        await contract.register(publicKey, password);
        console.log("User registered successfully");
    } catch (error) {
        console.error("Error registering user:", error);
        alert(`Error: ${error.message}`);
    }
});

document.getElementById("create-property-btn").addEventListener("click", async () => {
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    try {
        await contract.createProperty(description, price);
        console.log("Property created successfully");
    } catch (error) {
        console.error("Error creating property:", error);
        alert(`Error: ${error.message}`);
    }
});

document.getElementById("create-announcement-btn").addEventListener("click", async () => {
    const propertyId = document.getElementById("property-id").value;
    const price = document.getElementById("announcement-price").value;
    try {
        await contract.createAnnouncement(propertyId, price);
        console.log("Announcement created successfully");
    } catch (error) {
        console.error("Error creating announcement:", error);
        alert(`Error: ${error.message}`);
    }
});

document.getElementById("purchase-property-btn").addEventListener("click", async () => {
    const announcementId = document.getElementById("announcement-id").value;
    try {
        await contract.purchaseProperty(announcementId);
        console.log("Property purchased successfully");
    } catch (error) {
        console.error("Error purchasing property:", error);
        alert(`Error: ${error.message}`);
    }
});

document.getElementById("withdraw-funds-btn").addEventListener("click", async () => {
    const amount = document.getElementById("amount").value;
    try {
        await contract.withdrawFunds(amount);
        console.log("Funds withdrawn successfully");
    } catch (error) {
        console.error("Error withdrawing funds:", error);
        alert(`Error: ${error.message}`);
    }
});

// Функции для обновления интерфейса
async function updatePropertiesList() {
    const properties = await contract.getProperties();
    const list = document.getElementById("properties-list");
    list.innerHTML = "";
    properties.forEach((property) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Property ID: ${property.id}, Description: ${property.description}, Price: ${property.price}`;
        list.appendChild(listItem);
    });
}

async function updateAnnouncementsList() {
    const announcements = await contract.getAnnouncements();
    const list = document.getElementById("announcements-list");
    list.innerHTML = "";
    announcements.forEach((announcement) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Announcement ID: ${announcement.id}, Property ID: ${announcement.propertyId}, Price: ${announcement.price}`;
        list.appendChild(listItem);
    });
}

async function updateUserBalance() {
    const userBalance = await contract.getUserBalance();
    document.getElementById("user-balance-text").textContent = `User Balance: ${userBalance}`;
}

// Обновляем интерфейс
updatePropertiesList();
updateAnnouncementsList();
updateUserBalance();