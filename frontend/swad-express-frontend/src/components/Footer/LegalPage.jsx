const sections = {
  privacy: {
    title: "Privacy Policy",
    intro:
      "This policy explains how SwadExpress handles information when you use our food ordering application.",
    content: [
      ["Information we collect", "We may collect your name, email address, delivery addresses, order details, and information needed to process payments and provide customer support."],
      ["How we use information", "We use this information to create your account, deliver orders, process payments, send order updates, improve the service, and respond to support requests."],
      ["Payments and security", "Payment details are processed by our payment provider. SwadExpress does not store your complete card or banking credentials. We use reasonable safeguards to protect account and order information."],
      ["Sharing information", "We share only the information needed with restaurants, delivery partners, payment providers, and service providers to complete your order or operate the application."],
      ["Your choices", "You may request help with your account or personal information by emailing support.swadexpress@gmail.com."],
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro:
      "By using SwadExpress, you agree to use the service responsibly and to follow these terms.",
    content: [
      ["Accounts", "You are responsible for keeping your account credentials secure and for providing accurate registration and delivery information."],
      ["Orders and payments", "An order is confirmed after payment authorization and successful order creation. Prices, availability, delivery charges, and restaurant charges may change before checkout."],
      ["Restaurants and menus", "Restaurants are responsible for their menu information, preparation, availability, and fulfillment. Images and descriptions may vary from the delivered item."],
      ["Cancellations and refunds", "Cancellation and refund decisions depend on the order status, restaurant policy, payment provider, and applicable consumer protection rules."],
      ["Acceptable use", "Do not misuse the application, submit fraudulent orders, interfere with the service, or use another person’s account."],
      ["Support", "For questions or concerns, contact support.swadexpress@gmail.com."],
    ],
  },
};

const LegalPage = ({ type }) => {
  const page = sections[type];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#0f0f0f] px-4! py-8! text-white sm:px-8! lg:px-16!">
      <article className="mx-auto max-w-4xl rounded-3xl border border-[#3b2026] bg-[#181818] p-5! text-center shadow-2xl sm:p-8! lg:p-10!">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
          SwadExpress
        </p>
        <h1 className="mt-3! text-3xl font-bold sm:text-4xl">{page.title}</h1>
        <p className="mt-4! leading-7 text-gray-400">{page.intro}</p>

        <div className="mx-auto mt-8! max-w-3xl space-y-7!">
          {page.content.map(([heading, text]) => (
            <section key={heading}>
              <h2 className="text-lg font-semibold text-red-200">{heading}</h2>
              <p className="mt-2! leading-7 text-gray-300">{text}</p>
            </section>
          ))}
        </div>

        <p className="mt-10! border-t border-[#2a2a2a] pt-5! text-sm text-gray-500">
          Questions? Email{" "}
          <a
            href="mailto:support.swadexpress@gmail.com"
            className="text-red-300 hover:text-red-200"
          >
            support.swadexpress@gmail.com
          </a>
        </p>
      </article>
    </main>
  );
};

export default LegalPage;
