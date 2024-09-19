import React, { useState, useEffect } from "react";
import Button from "../../elements/Button";
import { useUser } from "@clerk/clerk-react";
import {
  DotsHorizontalIcon,
  RefreshIcon,
} from "@heroicons/react/outline";
import {
  MailIcon,
} from "@heroicons/react/solid";
import { useLocation, useNavigate } from "react-router-dom";
import {
  formatTimeStamp,
  countRemainingDays,
  formatLicensePlate,
  renderDurationText,
  renderTypeText,
  disableButton,
} from "../../../utils/utils";
import DueCarsSkeleton from "./DueCarsSkeleton";

const DURATION_OPTIONS = [
  { value: "", label: "Alegeți perioada" },
  { value: "expired", label: "Expirate" },
  { value: "today", label: "Astăzi" },
  { value: "1week", label: "7 zile" },
  { value: "2weeks", label: "14 zile" },
  { value: "month", label: "31 zile" },
];

const TYPE_OPTIONS = [
  { value: "", label: "Alegeți tipul" },
  { value: "checkup", label: "ITP" },
  { value: "insurance", label: "RCA" },
  { value: "vignette", label: "Rovinietă" },
];

function DueCarsSection({ dueCars, fetchCarsData, sendSms }) {
  const [selectedType, setSelectedType] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [headerText, setHeaderText] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    const duration = params.get("duration");

    if (type) setSelectedType(type);
    if (duration) setSelectedDuration(duration);
  }, [location.search]);

  useEffect(() => {
    if (selectedType && selectedDuration) {
      setHeaderText(renderDueCarsHeader());
    }
  }, [selectedType, selectedDuration, dueCars]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedType) params.set("type", selectedType);
    if (selectedDuration) params.set("duration", selectedDuration);

    navigate({ search: params.toString() }, { replace: true });
    fetchAndSetLoading();
  }, [selectedType, selectedDuration, navigate]);

  const fetchAndSetLoading = () => {
    if (selectedType && selectedDuration) {
      fetchCarsData(selectedDuration, selectedType);
      setLoading(true);
      setShowError(true);
      setTimeout(() => setLoading(false), 1500);
    }
  };

  const handleTypeChange = (e) => setSelectedType(e.target.value);
  const handleDurationChange = (e) => setSelectedDuration(e.target.value);

  const refreshData = () => {
    fetchAndSetLoading();
  };

  const renderTableRow = (car, index) => (
    <tr
      key={index}
      className="p-1 block border-b border-gray-300 md:table-row md:mb-0"
    >
      <td className="p-1 whitespace-nowrap flex justify-center md:table-cell">
        <span className="block font-bold max-sm:mr-1 md:hidden">
          Serie șasiu:
        </span>
        {car.carVin}
      </td>
      <td className="p-1 whitespace-nowrap flex justify-center md:table-cell">
        <span className="block font-bold max-sm:mr-1 md:hidden">
          Proprietar:
        </span>
        {car.owner}
      </td>
      <td className="p-1 whitespace-nowrap flex justify-center md:table-cell">
        <span className="block font-bold max-sm:mr-1 md:hidden">
          Număr Înmatriculare:
        </span>
        {formatLicensePlate(car.plateNumber).toUpperCase()}
      </td>
      <td className="p-1 whitespace-nowrap flex justify-center md:table-cell">
        <span className="block font-bold max-sm:mr-1 md:hidden">
          Dată expirare:
        </span>
        {getExpirationDate(car)}
      </td>
      <td className="p-1 whitespace-nowrap flex justify-center md:table-cell">
        <span className="block font-bold max-sm:mr-1 md:hidden">
          Ultima notificare:
        </span>
        {car.lastNotificationDate ? (
          <span>
            {formatTimeStamp(car.lastNotificationDate)}
          </span>
        ) : (
          "-"
        )}
      </td>
      <td className="p-2 whitespace-nowrap flex justify-center md:table-cell space-x-1">
        <Button
          variant="blue"
          className="tiny"
          onClick={() => navigate(`/cars/${car._id}`, { state: { from: location.pathname + location.search } })}
        >
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
        {selectedDuration !== "expired" && (
          <Button
            variant={
              !disableButton(car.lastNotificationDate) ? "blue" : "disabled"
            }
            className="tiny"
            onClick={() => sendNotification(car)}
            disabled={disableButton(car.lastNotificationDate)}
            title={
              disableButton(car.lastNotificationDate)
                ? "Notificare deja trimisă!"
                : "Trimiteți notificare!"
            }
          >
            <MailIcon className="h-4 w-4" />
          </Button>
        )}
      </td>
    </tr>
  );

  const getExpirationDate = (car) => {
    const expirationDateFields = {
      vignette: car.vignetteExpirationDate,
      checkup: car.checkUpExpirationDate,
      insurance: car.insuranceExpirationDate,
    };
    const expirationDate = expirationDateFields[selectedType];
    return expirationDate ? (
      <>
        {formatTimeStamp(expirationDate)}
        <span className="text-gray-400 ml-1">
          ({countRemainingDays(expirationDate)} zile)
        </span>
      </>
    ) : (
      "-"
    );
  };

  const sendNotification = (car) => {
    if (!disableButton(car.lastNotificationDate)) {
      sendSms(
        car._id,
        car.ownerPhoneNumber,
        car.plateNumber,
        renderTypeText(selectedType),
        selectedType === 'vignette'
          ? formatTimeStamp(car.vignetteExpirationDate)
          : selectedType === 'insurance'
            ? formatTimeStamp(car.insuranceExpirationDate)
            : selectedType === 'checkup'
              ? formatTimeStamp(car.checkUpExpirationDate)
              : null,
        selectedType === 'vignette'
          ? countRemainingDays(car.vignetteExpirationDate)
          : selectedType === 'insurance'
            ? countRemainingDays(car.insuranceExpirationDate)
            : selectedType === 'checkup'
              ? countRemainingDays(car.checkUpExpirationDate)
              : null,
        car.owner,
        selectedType
      );
    }
  };

  const renderDueCarsHeader = () => {
    if (selectedDuration && selectedType) {
      if (dueCars.length > 0) {
        if (selectedDuration !== "expired") {
          return (
            <>
              <span className="text-red-600 font-bold">
                {renderTypeText(selectedType)}
              </span>{" "}
              următoarelor{" "}
              <span className="text-red-600 font-bold">
                {dueCars.length}
              </span>{" "}
              {selectedDuration !== "today" ? (
                <>
                  mașini expiră în{" "}
                  <span className="text-red-600 font-bold">
                    {renderDurationText(selectedDuration)}!
                  </span>
                </>
              ) : (
                <>
                  mașini expiră{" "}
                  <span className="text-red-600 font-bold">
                    {renderDurationText(selectedDuration)}!
                  </span>
                </>
              )}
            </>
          );
        } else {
          return (
            <>
              Următoarele{" "}
              <span className="text-red-600 font-bold">
                {dueCars.length}
              </span>{" "}
              mașini au{" "}
              <span className="text-red-600 font-bold">
                {renderTypeText(selectedType)}
              </span>{" "}
              {renderTypeText(selectedType) === "Rovinieta"
                ? "expirată"
                : "expirat"}
              !
            </>
          );
        }
      } else {
        return (
          <div className="flex text-center justify-center text-lg text-red-500 font-bold max-sm:p-2">
            <h1>
              {selectedDuration === "expired" ? (
                renderTypeText(selectedType) === "ITP-ul" ? (
                  "Niciun ITP expirat!"
                ) : renderTypeText(selectedType) === "Rovinieta" ? (
                  "Nicio Rovinietă expirată!"
                ) : renderTypeText(selectedType) === "RCA-ul" ? (
                  "Niciun RCA expirat!"
                ) : (
                  ""
                )
              ) : (
                <>
                  {selectedDuration === "today"
                    ? ""
                    : "În următoarele "}
                  {renderDurationText(selectedDuration)} nu expiră
                  {renderTypeText(selectedType) === "ITP-ul"
                    ? " niciun ITP!"
                    : renderTypeText(selectedType) === "Rovinieta"
                      ? " nicio Rovinietă!"
                      : renderTypeText(selectedType) === "RCA-ul"
                        ? " niciun RCA!"
                        : ""}
                </>
              )}
            </h1>
          </div>
        );
      }
    }
    return null;
  };

  return (
    user && (
      <>
        <div className="p-4 overflow-hidden">
          <div className="bg-gray-100 shadow-md rounded-lg p-2 md:mx-auto md:w-1/3 md:mb-4 md:p-2">
            <h2 className="font-bold text-center text-xl mb-2 md:text-2xl">
              Alegeți tipul verificării și perioada:
            </h2>
            <div className="flex justify-center space-x-2">
              <div className="mb-2">
                <select
                  id="typeSelect"
                  name="typeSelect"
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-sm"
                >
                  {TYPE_OPTIONS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="max-sm:text-xs"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <select
                  id="durationSelect"
                  name="durationSelect"
                  value={selectedDuration}
                  onChange={handleDurationChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-sm"
                >
                  {DURATION_OPTIONS.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="max-sm:text-xs"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                size="tiny"
                className="mb-0.5 text-blue-600"
                onClick={refreshData}
              >
                <RefreshIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
          {loading ? (
            <DueCarsSkeleton selectedDuration={selectedDuration} />
          ) : dueCars.length > 0 ? (
            <div className="rounded-lg">
              <h2 className="duration-300 text-lg md:text-xl font-semibold my-2 md:my-4 text-center">
                {headerText}
              </h2>
              <div className="table-wrapper overflow-y-auto max-h-[calc(100vh-280px)] h-86 scrollbar-thin">
                <table className="min-w-full divide-y md:border-2 divide-blue-200 table text-center block">
                  <thead className="bg-blue-500 sticky top-0 hidden md:table-header-group">
                    <tr className="md:table-row hidden">
                      <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                        Serie șasiu
                      </th>
                      <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                        Proprietar
                      </th>
                      <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                        Număr Înmatriculare
                      </th>
                      <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                        Dată expirare
                      </th>
                      <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                        Ultima Notificare
                      </th>
                      <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                        Acțiuni
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white md:divide-y md:divide-gray-200 block md:table-row-group">
                    {dueCars.map(renderTableRow)}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <>
              {headerText}
            </>
          )}
        </div>
      </>
    )
  );
}

export default DueCarsSection;
