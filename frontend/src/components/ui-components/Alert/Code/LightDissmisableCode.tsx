

import CodeModal from "../../CodeModal";

const LightDissmisableCode = () => {
  return (
    <div>
      <CodeModal>
        {`
    import { Alert } from "flowbite-react";
    
    <Alert
      color="lightprimary"
      onDismiss={() => alert("Alert dismissed!")}
      className="rounded-md"
    >
      <span className="font-medium">Primary</span> - A simple Primary
      alert
    </Alert>

    <Alert
      color="lightsecondary"
      onDismiss={() => alert("Alert dismissed!")}
      className="rounded-md"
    >
      <span className="font-medium">Secondary</span> - A simple
      Secondary alert
    </Alert>

    <Alert
      color="lightsuccess"
      onDismiss={() => alert("Alert dismissed!")}
      className="rounded-md"
    >
      <span className="font-medium">Success</span> - A simple Success
      alert
    </Alert>

    <Alert
      color="lightinfo"
      onDismiss={() => alert("Alert dismissed!")}
      className="rounded-md"
    >
      <span className="font-medium">Info</span> - A simple Info alert
    </Alert>

    <Alert
      color="lightwarning"
      onDismiss={() => alert("Alert dismissed!")}
      className="rounded-md"
    >
      <span className="font-medium">Warning</span> - A simple Warning
      alert
    </Alert>

    <Alert
      color="lighterror"
      onDismiss={() => alert("Alert dismissed!")}
      className="rounded-md"
    >
      <span className="font-medium">Error</span> - A simple Error alert
    </Alert>

    <Alert
      color="dark"
      onDismiss={() => alert("Alert dismissed!")}
      className="rounded-md"
    >
      <span className="font-medium">Dark</span> - A simple Dark alert
    </Alert>      
                `}
      </CodeModal>
    </div>
  );
};

export default LightDissmisableCode;
