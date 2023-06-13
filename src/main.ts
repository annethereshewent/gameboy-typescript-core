import { Gameboy } from "./Gameboy"

const romInput = document.getElementById("rom-input")

romInput?.addEventListener("change", (e) => {
  handleFileChange(e)
})

let gameboy: Gameboy|null = null

async function handleFileChange(e: Event) {
  gameboy = new Gameboy()
  const files = (e.target as HTMLInputElement)?.files
  if (files != null) {
    const file = files[0]

    let rom = await fileToArrayBuffer(file)

    if (rom != null) {
      gameboy.loadCartridge(rom as ArrayBuffer)

      gameboy.run()
    }
  }
}

function loadRom() {
  document.getElementById("rom-input")?.click()
}

function enterFullScreen() {
  document.documentElement.requestFullscreen()
}

function showControlsModal() {
  const modal = document.getElementById("modal")

  if (modal != null) {
    modal.style.display = "block"
  }
}

function hideControlsModal() {
  const modal = document.getElementById("modal")

  if (modal != null) {
    modal.style.display = "none"
  }
}

function fileToArrayBuffer(file: File){
  const fileReader = new FileReader()

  return new Promise((resolve, reject) => {
    fileReader.onload = () => resolve(fileReader.result)

    fileReader.onerror = () => {
      fileReader.abort()
      reject(new Error("Error parsing file"))
    }

    fileReader.readAsArrayBuffer(file)
  })
}