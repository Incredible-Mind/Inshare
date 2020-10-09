const dropZone = document.querySelector('.drop-zone');
const browseBtn = document.querySelector('.browseBtn');
const fileInput = document.querySelector('#fileInput');
const progressContainer = document.querySelector('.progress-container');
const bgProgress = document.querySelector('.bg-progress');
const progressBar = document.querySelector('.progress-bar');
const percentDiv = document.querySelector('#percent');
const copyId = document.querySelector('#copyId');
const sharingContainer = document.querySelector('.sharing-container');
const fileURL = document.querySelector('#fileURL');
const emailForm = document.querySelector('#emailFrom');
const toast = document.querySelector('.toast');
const maxAllowtedSize = 100 * 1024 * 1024;
const host = "http://localhost:5000/"; //if you doesn't want to do the backend
// const host = "https://innshare.herokuapp.com/"; if you doesn't want to do the backend
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault()
    if (!dropZone.classList.contains("dragged")) {
        dropZone.classList.add("dragged")
    };
});
dropZone.addEventListener("dragleave", (e) => {
    dropZone.classList.remove("dragged")
});
dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    if (files.length) {
        fileInput.files = files;
        uploadFile();
    }
});
fileInput.addEventListener("change", () => {
    uploadFile();
})
browseBtn.addEventListener("click", () => {
    fileInput.click();
});
copyId.addEventListener("click", () => {
    fileURL.select();
    document.execCommand("copy")
    showToast("Link Copied");
});
emailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = fileURL.value;
    const formData = {
        uuid: url.split("/").splice(-1, 1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailFrom: emailForm.elements["from-email"].value
    };
    emailForm[2].setAttribute("disabled", "true");
    fetch(emailURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    }).then(res => res.json())
        .then(({ success }) => {
            if (success) {
                sharingContainer.style.display = "none";
                showToast("Email Sent");
            }
        });
});
const uploadFile = () => {
    if (fileInput.files.length > 1) {
        resetFileInput();
        showToast("Only Upload 1 File!");
        return;
    }
    const file = fileInput.files[0];
    if (file.size > maxAllowtedSize) {
        showToast("Can't Upload More Than 100 MB")
        resetFileInput();
        return;
    }
    progressContainer.style.display = "block";
    const formData = new FormData();
    formData.append("myfile", file)
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            showLink(JSON.parse(xhr.response));
        }
    };
    xhr.upload.onprogress = updateProgress;
    xhr.upload.onerror = () => {
        resetFileInput()
        showToast(`Error In Upload: ${xhr.statusText}`);
    }
    xhr.open("POST", uploadURL);
    xhr.send(formData);
};
const updateProgress = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);
    bgProgress.style.width = `${percent}%`;
    percentDiv.innerText = percent;
    progressBar.style.transform = `scaleX(${percent / 100})`
}
const showLink = ({ file: url }) => {
    emailForm[2].removeAttribute("disabled", "true");
    resetFileInput()
    progressContainer.style.display = "none";
    sharingContainer.style.display = "block";
    fileURL.value = (url)
}
let toastTimer;
const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.display = "block";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
};
const resetFileInput = () => {
    fileInput.value = "";
}