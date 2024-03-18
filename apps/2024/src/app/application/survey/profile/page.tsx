"use client";

import { useState } from "react";

import { Textarea } from "@knighthacks/ui/textarea";

// WORK IN PROGRESS
// Use drop-down menu for shirt size, major, school, and graduation year
// Use tRPC to add profile
// Resume upload

export default function KhAccountRegister() {
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState(0);
  const [shirtSize, setShirtSize] = useState("" as "SM");
  const [major, setMajor] = useState("" as "Other");
  const [school, setSchool] = useState(
    "" as "The University of Central Florida",
  );
  const [gradYear, setGradYear] = useState("" as "2024");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [github, setGithub] = useState("");
  const [personalWebsite, setPersonalWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");

  return (
    <div className="mx-4 space-y-4">
      <h1>Create your Knight Hacks Profile ☠️</h1>
      <Textarea
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Textarea
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value as unknown as number)}
      />
      <Textarea
        placeholder="Shirt Size"
        value={shirtSize}
        onChange={(e) => setShirtSize(e.target.value as "SM")}
      />
      <Textarea
        placeholder="Major"
        value={major}
        onChange={(e) => setMajor(e.target.value as "Other")}
      />
      <Textarea
        placeholder="School"
        value={school}
        onChange={(e) =>
          setSchool(e.target.value as "The University of Central Florida")
        }
      />
      <Textarea
        placeholder="Graduation Year"
        value={gradYear}
        onChange={(e) => setGradYear(e.target.value as "2024")}
      />
      <Textarea
        placeholder="Address 1"
        value={address1}
        onChange={(e) => setAddress1(e.target.value)}
      />
      <Textarea
        placeholder="Address 2"
        value={address2}
        onChange={(e) => setAddress2(e.target.value)}
      />
      <Textarea
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <Textarea
        placeholder="State"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
      <Textarea
        placeholder="Zip"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
      />
      <Textarea
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <Textarea
        placeholder="Github"
        value={github}
        onChange={(e) => setGithub(e.target.value)}
      />
      <Textarea
        placeholder="Personal Website"
        value={personalWebsite}
        onChange={(e) => setPersonalWebsite(e.target.value)}
      />
      <Textarea
        placeholder="Linkedin"
        value={linkedin}
        onChange={(e) => setLinkedin(e.target.value)}
      />
    </div>
  );
}
