import { useState } from "react";
import { ModeToggle } from "./components/ui/mode-toggle";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import HTMLValidation from "./components/web/HTMLValidation";

const App = () => {
  const [username, setUsername] = useState("");
  const [urlsToValidate, setUrlsToValidate] = useState<string[]>([]);

  const handleValidate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username) return;

    setUrlsToValidate([
      `https://${username}.github.io/wdd130/wwr/`,
      `https://${username}.github.io/wdd130/wwr/about.html`,
      `https://${username}.github.io/wdd130/wwr/trips.html`,
      `https://${username}.github.io/wdd130/wwr/contact.html`,
    ]);
  };

  return (
    <main>
      <section className="bg-[#006eb6]">
        <div className="container p-4 mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src="/byui-logo.jpg"
              alt="BYUI Logo"
              width={150}
              height={150}
              className="size-12"
            />
            <h1 className="text-2xl text-white">WDD130 Validator</h1>
          </div>

          <ModeToggle />
        </div>
      </section>

      <section className="container p-4 mx-auto">
        <div className="flex justify-center items-center gap-2">
          <p className="font-semibold text-nowrap">Github Username</p>

          <form
            action="#"
            className="flex-1 flex items-center justify-center gap-2"
            onSubmit={handleValidate}
          >
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="githubusername"
              className="flex-1"
            />
            <Button className="font-semibold cursor-pointer">Validate</Button>
          </form>
        </div>
      </section>

      <HTMLValidation urls={urlsToValidate} />
    </main>
  );
};

export default App;
