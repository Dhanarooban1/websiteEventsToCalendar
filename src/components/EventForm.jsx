import { useState, useEffect } from "react";
import { Link } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { getGoogleAuthToken, createCalendarEvent } from "../services/oauth";
import APISettings from "./ApiSetting";
import GoogleColorPicker from "./googleColors"
const googleColors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

const convertDate = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};




export default function EventForm() {
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    virtualLink: "",
    tags: [],
    priority: "medium",
    notification: "30",
    color: "#0A84FF"
  });

  const [showPopup, setShowPopup] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaveing, SetIsSaving] = useState(false);
  const [isApiValid, setIsApiValid] = useState(false);


  // Set data on  first extension load from userFromData 
  useEffect(() => {
    chrome.storage.local.get("userFormData", (userData) => {
      if (userData.userFormData) {
        console.log("from userformdata", userData.userFormData)
        try {
          const parsedUserData = JSON.parse(userData.userFormData);
          if (parsedUserData.date) {
            parsedUserData.date = convertDate(parsedUserData.date);
          }
          setFormData(parsedUserData);
        } catch (err) {
          console.error("Error parsing userFormData:", err);
        }
      }
    });
  }, []);



  // Set data on formdata change
  useEffect(() => {
    chrome.storage.local.set({ userFormData: JSON.stringify(formData) });
  }, [formData]);




  useEffect(() => {
    const handleStorageChange = (changes, areaName) => {
      if (areaName === "local" && changes.geminiExtractedData) {
        const newData = changes.geminiExtractedData.newValue;
        console.log("from newdata", newData)
        if (newData) {
          try {
            const updatedData = { ...newData };
            if (updatedData.date) {
              updatedData.date = convertDate(updatedData.date);
            }

            const allNull = Object.keys(updatedData).every(
              (key) => updatedData[key] === null
            );

            if (allNull) {
              alert("No events from selected! Please select some text and try again.");
              setIsExtracting(false);
              return;
            }


            setFormData((prev) => ({ ...prev, ...updatedData }));
          } catch (err) {
            console.error("Error updating formData from storage change:", err);
          } finally {
            setIsExtracting(false);
          }
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);






  const clearStorage = () => {
    chrome.storage.local.remove(["userFormData", "geminiExtractedData"], () => {
      setFormData({
        eventName: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        virtualLink: "",
        tags: [],
        priority: "medium",
        notification: "30",
        color: "#0A84FF"
      });
    });
  };

  const extractText = () => {
    setIsExtracting(true);
    chrome.storage.local.remove("geminiExtractedData", () => {
      chrome.runtime.sendMessage({ action: "display-selected-text" }, (response) => {
        if (!(response && response.success)) {
          console.error("Extraction failed or no response:", response);
          setIsExtracting(false);
        }
      });
    });
  };


  useEffect(() => {
    const messageListener = (message, sender, sendResponse) => {
      if (message.action === "extraction-Data") {
        setIsExtracting(true);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "date" && value) {
      setFormData((prev) => ({ ...prev, [name]: convertDate(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    SetIsSaving(true);
    try {

      if (!formData.eventName || !formData.date || !formData.startTime || !formData.endTime) {
        throw new Error('Please fill in all required fields (Event Name, Date, Start Time, and End Time)');
      }

      const token = await getGoogleAuthToken();
      await createCalendarEvent(token, formData);


      clearStorage();
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        SetIsSaving(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to create event:', error);
      alert(error.message || 'Failed to create event. Please try again.');
      SetIsSaving(false);
    }
  };



  const renderStep = () => {
    const inputStyles = "w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-gray-700";
    const selectStyles = "w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-gray-700 appearance-none";

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                name="eventName"
                value={formData.eventName || ""}
                onChange={handleInputChange}
                className={inputStyles}
                placeholder="Event name"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={formData.date || ""}
                  onChange={handleInputChange}
                  className={inputStyles}
                  required
                />
              </div>
              <div className="relative">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className={selectStyles}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <GoogleColorPicker
                selectedColor={formData.color}
                onColorChange={(color) => setFormData(prev => ({ ...prev, color }))}
              />
            </div>

          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="relative">
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className={`${inputStyles} h-32 resize-none`}
                placeholder="Event description"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="time"
                name="startTime"
                value={formData.startTime || ""}
                onChange={handleInputChange}
                className={inputStyles}
                required
              />
              <input
                type="time"
                name="endTime"
                value={formData.endTime || ""}
                onChange={handleInputChange}
                className={inputStyles}
                required
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleInputChange}
              className={inputStyles}
              placeholder="Location or venue"
            />
            <input
              type="url"
              name="virtualLink"
              value={formData.virtualLink || ""}
              onChange={handleInputChange}
              className={inputStyles}
              placeholder="Virtual meeting link (optional)"
            />
            <select
              name="notification"
              value={formData.notification}
              onChange={handleInputChange}
              className={selectStyles}
            >
              <option value="0">No reminder</option>
              <option value="15">15 minutes before</option>
              <option value="30">30 minutes before</option>
              <option value="60">1 hour before</option>
              <option value="1440">1 day before</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(3, prev + 1));
  const previousStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  return (
    <div className="w-full max-w-md mx-auto ">
      <APISettings onValidated={setIsApiValid} />
      {isApiValid ? (
        <form className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <Link className="w-6 h-6 text-gray-900" />
            <h2 className="text-2xl font-semibold text-gray-900">
              {currentStep === 1
                ? "Event Details"
                : currentStep === 2
                  ? "Time & Description"
                  : "Location & Notifications"}
            </h2>
            <div className="flex gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${step === currentStep
                      ? "bg-blue-500 w-4"
                      : step < currentStep
                        ? "bg-blue-200"
                        : "bg-gray-200"
                    }`}
                />
              ))}
            </div>
          </div>

          {renderStep()}

          <div className="flex justify-between pt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={previousStep}
                className="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors duration-200"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={extractText}
                className="px-6 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200"
                disabled={isExtracting}
              >
                {isExtracting ? <>
                  Extracing... <ClipLoader color={googleColors[0]} size={20} />
                </>
                  : "Extract Info"}
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                disabled={isSaveing}
              >
                {isSaveing ? <>
                  Saving...
                  <ClipLoader color={googleColors[0]} size={20} />
                </> : "Save to Calendar"}
              </button>
            )}
          </div>
        </form>
      ) : null}
      {showPopup && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white rounded-lg p-4 shadow-lg animate-fade-in">
          <p className="font-medium">Event saved successfully! ✨</p>
        </div>
      )}

    </div>
  );
}