
// ==================================
// HOTEL MANAGEMENT SYSTEM
// JAVASCRIPT
// ==================================


// INITIAL ROOM DETAILS

let rooms = [
    { number: "101", type: "Deluxe Room", price: 3500, status: "Occupied" },
    { number: "102", type: "Standard Room", price: 2500, status: "Occupied" },
    { number: "103", type: "Suite", price: 5500, status: "Available" },
    { number: "104", type: "Deluxe Room", price: 3500, status: "Maintenance" },
    { number: "105", type: "Standard Room", price: 2500, status: "Available" },
    { number: "106", type: "Suite", price: 5500, status: "Available" }
];


// INITIAL BOOKING DETAILS

let bookings = [
    {
        id: 1,
        name: "Rahul Kumar",
        email: "rahul@gmail.com",
        phone: "9876543210",
        room: "101",
        checkIn: "2026-11-20",
        checkOut: "2026-11-23",
        amount: 10500,
        status: "Confirmed"
    },
    {
        id: 2,
        name: "Anjali Sharma",
        email: "anjali@gmail.com",
        phone: "9876501234",
        room: "102",
        checkIn: "2026-11-21",
        checkOut: "2026-11-25",
        amount: 10000,
        status: "Checked In"
    }
];

let nextBookingId = 3;


// ==================================
// NAVIGATION
// ==================================

function showSection(sectionId) {

    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");

    const menuItems = document.querySelectorAll(".menu li");

    menuItems.forEach(item => {

        item.classList.remove("active");

        if (item.getAttribute("onclick").includes("'" + sectionId + "'")) {
            item.classList.add("active");
        }

    });

    renderDashboard();
}


// ==================================
// NOTIFICATION
// ==================================

function showNotification(message) {

    const notification = document.getElementById("notification");

    notification.textContent = message;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}


// ==================================
// DISPLAY ROOMS
// ==================================

function renderRooms() {

    const roomList = document.getElementById("roomList");
    const dashboardRooms = document.getElementById("dashboardRooms");

    roomList.innerHTML = "";
    dashboardRooms.innerHTML = "";

    rooms.forEach(room => {

        let statusClass = room.status.toLowerCase() + "-room";

        const card = document.createElement("div");
        card.className = "room-card " + statusClass;

        const heading = document.createElement("h2");
        heading.textContent = "Room " + room.number;

        const type = document.createElement("p");
        type.textContent = room.type;

        const price = document.createElement("h3");
        price.textContent = "₹" + room.price + " / night";

        const status = document.createElement("span");
        status.textContent = room.status;

        card.append(heading, type, price, status);

        roomList.appendChild(card);

        // Dashboard room overview

        const smallCard = document.createElement("div");
        smallCard.className = "room " + statusClass;

        const smallHeading = document.createElement("h3");
        smallHeading.textContent = "Room " + room.number;

        const smallType = document.createElement("p");
        smallType.textContent = room.type;

        const smallStatus = document.createElement("span");
        smallStatus.textContent = room.status;

        smallCard.append(smallHeading, smallType, smallStatus);

        dashboardRooms.appendChild(smallCard);

    });

    updateRoomDropdown();
}


// ==================================
// ROOM DROPDOWN
// ==================================

function updateRoomDropdown() {

    const dropdown = document.getElementById("roomNumber");

    dropdown.innerHTML = '<option value="">Select Room</option>';

    rooms.forEach(room => {

        if (room.status === "Available") {

            const option = document.createElement("option");

            option.value = room.number;
            option.textContent = room.number + " - " + room.type +
                " (₹" + room.price + ")";

            dropdown.appendChild(option);
        }

    });
}


// ==================================
// UPDATE DASHBOARD
// ==================================

function renderDashboard() {

    const total = rooms.length;

    const available = rooms.filter(
        room => room.status === "Available"
    ).length;

    const occupied = rooms.filter(
        room => room.status === "Occupied"
    ).length;

    document.getElementById("totalRooms").textContent = total;

    document.getElementById("availableRooms").textContent = available;

    document.getElementById("occupiedRooms").textContent = occupied;

    document.getElementById("bookingCount").textContent = bookings.length;

    const totalRevenue = bookings.reduce(
        (sum, booking) => sum + booking.amount, 0
    );

    document.getElementById("revenue").textContent =
        "₹" + totalRevenue.toLocaleString("en-IN");

    renderRooms();
    renderBookings();
    renderGuests();

}


// ==================================
// BOOKING MODAL
// ==================================

function openBookingForm() {

    updateRoomDropdown();

    if (rooms.every(room => room.status !== "Available")) {
        showNotification("No rooms are currently available!");
        return;
    }

    document.getElementById("bookingModal").style.display = "block";

}

function closeBookingForm() {

    document.getElementById("bookingModal").style.display = "none";

}


// ==================================
// ADD BOOKING
// ==================================

function addBooking(event) {

    event.preventDefault();

    const guestName = document.getElementById("guestName").value.trim();
    const guestEmail = document.getElementById("guestEmail").value.trim();
    const guestPhone = document.getElementById("guestPhone").value.trim();
    const roomNumber = document.getElementById("roomNumber").value;
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;

    // NAME VALIDATION

    if (!/^[A-Za-z ]+$/.test(guestName)) {
        showNotification("Name must contain letters only!");
        return;
    }

    // PHONE VALIDATION

    if (!/^[0-9]{10}$/.test(guestPhone)) {
        showNotification("Enter a valid 10 digit phone number!");
        return;
    }

    // EMAIL VALIDATION

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
        showNotification("Enter a valid email address!");
        return;
    }

    // DATE VALIDATION

    if (!checkIn || !checkOut || checkOut <= checkIn) {
        showNotification("Check-out must be after check-in!");
        return;
    }

    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    if (checkIn < localToday) {
        showNotification("Check-in date cannot be in the past!");
        return;
    }

    // CHECK ROOM AVAILABILITY

    const selectedRoom = rooms.find(
        room => room.number === roomNumber
    );

    if (!selectedRoom || selectedRoom.status !== "Available") {
        showNotification("Please select an available room!");
        return;
    }

    // CALCULATE NUMBER OF NIGHTS

    const startDate = new Date(checkIn + "T00:00:00");
    const endDate = new Date(checkOut + "T00:00:00");

    const nights = Math.round(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
    );

    const amount = nights * selectedRoom.price;

    // CREATE BOOKING

    const newBooking = {
        id: nextBookingId++,
        name: guestName,
        email: guestEmail,
        phone: guestPhone,
        room: roomNumber,
        checkIn: checkIn,
        checkOut: checkOut,
        amount: amount,
        status: "Confirmed"
    };

    bookings.push(newBooking);

    // UPDATE ROOM STATUS

    selectedRoom.status = "Occupied";

    // RESET FORM

    document.getElementById("bookingForm").reset();

    closeBookingForm();

    renderDashboard();

    showNotification("Booking created successfully!");

}


// ==================================
// DISPLAY BOOKINGS
// ==================================

function renderBookings() {

    const table = document.getElementById("bookingTable");
    const recentTable = document.getElementById("recentBookingTable");

    table.innerHTML = "";
    recentTable.innerHTML = "";

    bookings.forEach(booking => {

        const row = document.createElement("tr");

        const values = [
            "#BK" + String(booking.id).padStart(3, "0"),
            booking.name,
            booking.phone,
            booking.room,
            booking.checkIn,
            booking.checkOut,
            "₹" + booking.amount.toLocaleString("en-IN")
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // STATUS

        const statusCell = document.createElement("td");

        const status = document.createElement("span");

        status.className = "status " +
            (booking.status === "Confirmed" ? "confirmed" :
            booking.status === "Checked In" ? "checked" : "pending");

        status.textContent = booking.status;

        statusCell.appendChild(status);
        row.appendChild(statusCell);

        // ACTIONS

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", () => {
            editBooking(booking.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", () => {
            deleteBooking(booking.id);
        });

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);

        table.appendChild(row);

        // RECENT BOOKINGS TABLE

        const recentRow = document.createElement("tr");

        const recentValues = [
            booking.name,
            booking.phone,
            booking.room,
            booking.checkIn,
            booking.checkOut
        ];

        recentValues.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            recentRow.appendChild(cell);
        });

        const recentStatusCell = document.createElement("td");
        const recentStatus = document.createElement("span");

        recentStatus.className = status.className;
        recentStatus.textContent = booking.status;

        recentStatusCell.appendChild(recentStatus);
        recentRow.appendChild(recentStatusCell);

        recentTable.appendChild(recentRow);

    });

}


// ==================================
// EDIT BOOKING
// ==================================

function editBooking(id) {

    const booking = bookings.find(item => item.id === id);

    if (!booking) return;

    const newName = prompt("Enter updated guest name:", booking.name);

    if (newName === null) return;

    const cleanName = newName.trim();

    if (!/^[A-Za-z ]+$/.test(cleanName)) {
        showNotification("Please enter letters only!");
        return;
    }

    booking.name = cleanName;

    renderDashboard();

    showNotification("Booking updated successfully!");

}


// ==================================
// DELETE BOOKING
// ==================================

function deleteBooking(id) {

    const booking = bookings.find(item => item.id === id);

    if (!booking) return;

    const confirmDelete = confirm(
        "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    const room = rooms.find(
        item => item.number === booking.room
    );

    if (room && room.status === "Occupied") {
        room.status = "Available";
    }

    bookings = bookings.filter(item => item.id !== id);

    renderDashboard();

    showNotification("Booking deleted successfully!");

}


// ==================================
// SEARCH RECENT BOOKINGS
// ==================================

function searchBookings() {

    const filter = document.getElementById("searchInput")
        .value.toLowerCase();

    const rows = document.querySelectorAll("#recentBookingTable tr");

    rows.forEach(row => {

        const guestName = row.cells[0].textContent.toLowerCase();

        row.style.display = guestName.includes(filter) ? "" : "none";

    });

}


// ==================================
// SEARCH ALL BOOKINGS
// ==================================

function searchAllBookings() {

    const filter = document.getElementById("bookingSearch")
        .value.toLowerCase();

    const rows = document.querySelectorAll("#bookingTable tr");

    rows.forEach(row => {

        const guestName = row.cells[1].textContent.toLowerCase();

        row.style.display = guestName.includes(filter) ? "" : "none";

    });

}


// ==================================
// DISPLAY GUESTS
// ==================================

function renderGuests() {

    const table = document.getElementById("guestTable");

    table.innerHTML = "";

    const uniqueGuests = new Map();

    bookings.forEach(booking => {
        uniqueGuests.set(booking.email, booking);
    });

    uniqueGuests.forEach(guest => {

        const row = document.createElement("tr");

        [guest.name, guest.email, guest.phone, guest.room]
            .forEach(value => {

                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);

            });

        table.appendChild(row);

    });

}


// ==================================
// SEARCH GUESTS
// ==================================

function searchGuests() {

    const filter = document.getElementById("guestSearch")
        .value.toLowerCase();

    const rows = document.querySelectorAll("#guestTable tr");

    rows.forEach(row => {

        const name = row.cells[0].textContent.toLowerCase();

        row.style.display = name.includes(filter) ? "" : "none";

    });

}


// ==================================
// ADD ROOM MODAL
// ==================================

function openRoomForm() {

    document.getElementById("roomModal").style.display = "block";

}

function closeRoomForm() {

    document.getElementById("roomModal").style.display = "none";

}


// ==================================
// ADD NEW ROOM
// ==================================

function addRoom(event) {

    event.preventDefault();

    const number = document.getElementById("newRoomNumber").value.trim();
    const type = document.getElementById("newRoomType").value;
    const price = Number(document.getElementById("newRoomPrice").value);

    if (!/^[0-9]+$/.test(number)) {
        showNotification("Room number must contain numbers only!");
        return;
    }

    if (rooms.some(room => room.number === number)) {
        showNotification("This room number already exists!");
        return;
    }

    if (!Number.isFinite(price) || price <= 0) {
        showNotification("Enter a valid room price!");
        return;
    }

    rooms.push({
        number: number,
        type: type,
        price: price,
        status: "Available"
    });

    document.getElementById("roomForm").reset();

    closeRoomForm();

    renderDashboard();

    showNotification("New room added successfully!");

}


// ==================================
// INPUT VALIDATION
// ==================================

// NAME: LETTERS AND SPACES ONLY

document.getElementById("guestName").addEventListener("input", function() {

    this.value = this.value.replace(/[^a-zA-Z ]/g, "");

});


// PHONE: NUMBERS ONLY

document.getElementById("guestPhone").addEventListener("input", function() {

    this.value = this.value.replace(/[^0-9]/g, "").slice(0, 10);

});


// ROOM NUMBER: NUMBERS ONLY

document.getElementById("newRoomNumber").addEventListener("input", function() {

    this.value = this.value.replace(/[^0-9]/g, "");

});


// HOTEL PHONE: NUMBERS ONLY

document.getElementById("hotelPhone").addEventListener("input", function() {

    this.value = this.value.replace(/[^0-9]/g, "").slice(0, 10);

});


// ==================================
// SAVE SETTINGS
// ==================================

function saveSettings() {

    const hotelName = document.getElementById("hotelName").value.trim();
    const adminEmail = document.getElementById("adminEmail").value.trim();
    const phone = document.getElementById("hotelPhone").value.trim();

    if (!hotelName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
        showNotification("Enter valid hotel details!");
        return;
    }

    if (phone && !/^[0-9]{10}$/.test(phone)) {
        showNotification("Enter a valid 10 digit phone number!");
        return;
    }

    document.querySelector(".header h1").textContent = hotelName;

    document.querySelector(".logo").textContent = "🏨 " + hotelName;

    document.getElementById("settingsMessage").textContent =
        "Settings saved successfully!";

    showNotification("Settings updated successfully!");

}


// ==================================
// CLOSE MODALS ON OUTSIDE CLICK
// ==================================

window.addEventListener("click", function(event) {

    const bookingModal = document.getElementById("bookingModal");
    const roomModal = document.getElementById("roomModal");

    if (event.target === bookingModal) {
        closeBookingForm();
    }

    if (event.target === roomModal) {
        closeRoomForm();
    }

});


// ==================================
// INITIALIZE PROJECT
// ==================================

renderDashboard();
