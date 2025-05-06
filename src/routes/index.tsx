import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2 flex flex-col gap-2">
      <h3 className="text-2xl font-bold">Welcome to the FieldFlow Test!</h3>
      <p>
        Replace this page with a list of organizations that the user belongs to per the instructions in the README.
      </p>
      <p>
        Buena suerte!
      </p>
      
    </div>
  )
}