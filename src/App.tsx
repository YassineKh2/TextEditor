import './App.css';
import {useEffect, useState ,ChangeEvent} from "react";
import {invoke} from "@tauri-apps/api/tauri";
import {open, save} from "@tauri-apps/api/dialog";
import {readTextFile} from "@tauri-apps/api/fs";
import {appWindow, WebviewWindow} from "@tauri-apps/api/window";
import {Route, Routes} from "react-router-dom";
import useKeyboardShortcut from 'use-keyboard-shortcut'
import FontSelector from "./Components/FontSelector.tsx";




function App() {


    const [note, SetNote] = useState('');
    const [CharacterCount, SetCharacterCount] = useState(0);

    // Font States
    const [fontSize, setFontSize] = useState(16);
    const [chosenFont, setChosenFont] = useState("font-PlaywriteITModerna")


    const handleChange = (e:ChangeEvent<HTMLTextAreaElement>) => {
        SetNote(e.target.value);
        SetCharacterCount(e.target.value.length);
    };

    const { flushHeldKeys } = useKeyboardShortcut(
        ["Control","s"],
        () => {
            console.log('save');
            saveMessage().then();
            flushHeldKeys();
        },
        {
            overrideSystem: false,
            ignoreInputFields: false,
            repeatOnHold: false
        }
    );



    const saveMessage = async () => {
        const savePath = await save();
        if (!savePath) return;
        try {
            await invoke('save_file', {path: savePath, content: note});
        } catch (e) {
            console.log(e)
        }
    }

    const openMessage = async () => {
        try {
            const filePath = await open({title: "Open a  File", filters: [{name: "Text Files", extensions: ['txt']}]});
            const content = await readTextFile(filePath as string, {});
            SetNote(content);
            SetCharacterCount(content.length)
        } catch (e) {
            console.log(e)
        }
    }

    // Handle Font Size
    useEffect(() => {
        let cntr = false;
        let font = fontSize;

        const handleKeyDown = (e: { key: string; }) => {
            if (e.key === "Control") {
                cntr = true
            }
        };

        const handleKeyUp = (e: { key: string; }) => {
            if (e.key === "Control") {
                cntr = false
            }
        };

        const handleScroll = (e: { deltaY: number; }) => {
            if (cntr && e.deltaY < 0) {
                console.log('scroll up');
                font = font + 15;
            }
            if (cntr && e.deltaY > 0) {
                console.log('scroll down');
                font = font - 15;
            }
            setFontSize(font);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("wheel", handleScroll);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("wheel", handleScroll);
        }
    }, []);

    // Handle Menu Events
    useEffect(() => {
        appWindow.listen('open_file', () => {
            openMessage().then();
        }).then()

        appWindow.listen('new_file', () => {
            SetNote('');
        }).then()

        appWindow.listen('save_file', () => {
            saveMessage().then();
        }).then()

        appWindow.listen('change-font', () => {
            openFontWindow().then();
        }).then()


    }, []);

    // Open Font Window
    const openFontWindow = async () => {
        new WebviewWindow('my-label', {
            title: 'My Webview',
            url: ' http://localhost:5173/fontview',
        });
    }

    useEffect(() => {
        console.log(chosenFont);
    }, [chosenFont]);


    return (
        <Routes>
            <Route
                path=""
                element={
                    <>
                        <div className="flex flex-col">
            <textarea
                className={"w-full h-dvh resize-none outline-none "+chosenFont}
                placeholder="Start typing your note..."
                value={note}
                style={{fontSize: fontSize}}
                onChange={handleChange}
            />
                            <div className="fixed flex bg-gray-200 justify-between bottom-0 w-full h-200 py-0.5">
                                <label>{CharacterCount}</label>
                                <button onClick={saveMessage} className="">Save</button>
                            </div>

                        </div>
                    </>
                }
            />
            <Route
                path="fontview"
                element={
                    <>
                        <FontSelector defaultValue={chosenFont} onChange={(e) => {
                            setChosenFont(e.target.value)
                        }}/>
                    </>
                }
            />
        </Routes>
    );
}

export default App;
